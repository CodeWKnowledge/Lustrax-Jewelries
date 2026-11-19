/*
  EDGE FUNCTION: verify-payment
  
  Runtime: Deno
  Purpose: 
  This function acts as a secure server-side bridge between Paystack and Supabase.
  It verifies that a payment reference from the frontend is legitimate, 
  ensures the paid amount matches the order total, and updates the database 
  status atomically.
  
  Environment Variables Required (Supabase Secrets):
  - PAYSTACK_SECRET_KEY: For authenticated Paystack API requests.
  - SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY: For elevated database access 
    (bypassing RLS to update payment statuses).
*/

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS Headers: Required for the browser to allow calling this function from the frontend.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // 1. Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Parse Request Body
    const body = await req.json().catch(() => ({}));
    const { reference, order_id } = body;

    // Guard: Ensure we have the necessary identifiers to verify the payment.
    if (!reference || !order_id) {
      return new Response(JSON.stringify({ error: "Missing reference or order_id" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    
    // 3. Initialize Supabase Service Role Client
    // SECURITY: We use the SERVICE_ROLE_KEY here because this backend function 
    // needs to update 'payment_status' and insert 'transactions' which are 
    // normally restricted by RLS for standard users.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 4. Fetch Order to verify legitimacy & amount
    // We retrieve the 'ground truth' price from our database.
    const { data: order, error: orderFetchError } = await supabaseClient
      .from('orders')
      .select('total_price, payment_status')
      .eq('id', order_id)
      .single();

    if (orderFetchError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Guard: Prevent double-processing or "replay attacks" on already paid orders.
    if (order.payment_status === 'paid') {
      return new Response(JSON.stringify({ message: "Order already paid" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // 5. Verify Transaction with Paystack API
    // We call Paystack directly to ensure the reference isn't forged.
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();

    // 6. Verification Logic
    if (paystackData.status && paystackData.data?.status === "success") {
      const amountPaid = paystackData.data.amount / 100; // Paystack sends Kobo, we use Naira.

      // CRITICAL SECURITY: Verify that the amount user paid to Paystack 
      // exactly matches (within 0.01) the order total in our database.
      if (Math.abs(amountPaid - order.total_price) > 0.01) {
        return new Response(JSON.stringify({ error: "Amount mismatch detected" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // SUCCESS PATH: Record the transaction and update the order.
      
      // 1. Log the financial transaction record
      const { error: txError } = await supabaseClient.from('transactions').insert({
        order_id,
        amount: amountPaid,
        payment_method: paystackData.data.channel || 'Paystack',
        status: 'success',
        reference
      });

      if (txError) throw txError;

      // 2. Mark the order as paid in the primary order record
      const { error: orderUpdateError } = await supabaseClient.from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', order_id);

      if (orderUpdateError) throw orderUpdateError;

      return new Response(JSON.stringify({ message: "Payment verified successfully" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else {
      // FAILURE PATH: Either Paystack failed or the user cancelled.
      // We log the failed attempt for auditing purposes.
      await supabaseClient.from('transactions').insert({
        order_id,
        amount: 0,
        payment_method: 'Paystack',
        status: 'failed',
        reference
      });

      return new Response(JSON.stringify({ error: "Payment verification failed or invalid reference" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
