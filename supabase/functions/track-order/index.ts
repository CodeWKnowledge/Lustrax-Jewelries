/**
 * LUSTRAX JEWELRIES - SUPABASE EDGE FUNCTIONS
 * 
 * track-order: Public order tracking endpoint for registered users and guest buyers.
 * Returns order status, fulfillment steps, timestamps, and item counts safely.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference, emailOrPhone } = await req.json()

    if (!reference || !reference.trim()) {
      return new Response(JSON.stringify({ error: 'Order reference number is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const cleanRef = reference.trim().replace(/^#/, '')
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Check if cleanRef is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanRef)

    // Build query - avoid applying ILIKE to UUID column (Postgres error: operator does not exist: uuid ~~* unknown)
    let query = supabase
      .from('orders')
      .select(`
        id,
        created_at,
        updated_at,
        status,
        total_amount,
        payment_reference,
        recipient_name,
        shipping_city,
        shipping_phone,
        state,
        city,
        activity_log,
        profiles (
          email,
          phone,
          full_name
        ),
        order_items (
          id,
          product_name,
          quantity,
          price,
          attributes
        )
      `)

    if (isUuid) {
      query = query.or(`payment_reference.ilike.%${cleanRef}%,id.eq.${cleanRef}`)
    } else {
      query = query.ilike('payment_reference', `%${cleanRef}%`)
    }

    const { data: orders, error } = await query.limit(1)

    if (error) {
      console.error('Track Order Query Error:', error)
      throw error
    }

    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ 
        found: false, 
        message: 'No order matching this reference was found. Please check the reference number on your receipt.' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const order = orders[0]

    // Optional verification if emailOrPhone was provided
    if (emailOrPhone && emailOrPhone.trim()) {
      const input = emailOrPhone.trim().toLowerCase()
      const orderEmail = (order.profiles?.email || '').toLowerCase()
      const orderPhone = (order.shipping_phone || order.profiles?.phone || '').replace(/\s+/g, '')
      const inputPhone = input.replace(/\s+/g, '')

      const matchesEmail = input.includes('@') && orderEmail.includes(input)
      const matchesPhone = !input.includes('@') && (orderPhone.includes(inputPhone) || inputPhone.includes(orderPhone))

      if (!matchesEmail && !matchesPhone) {
        return new Response(JSON.stringify({
          found: false,
          message: 'The email or phone number provided does not match our records for this order reference.'
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Mask sensitive contact details for privacy
    const rawEmail = order.profiles?.email || ''
    const maskedEmail = rawEmail.includes('@') 
      ? rawEmail.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => `${a}***${c}`) 
      : '***'

    const sanitizedOrder = {
      id: order.id,
      reference: order.payment_reference || order.id.slice(0, 8).toUpperCase(),
      status: order.status || 'confirmed',
      created_at: order.created_at,
      updated_at: order.updated_at,
      total_amount: order.total_amount,
      recipient_name: order.recipient_name || order.profiles?.full_name || 'Valued Client',
      destination: [order.city || order.shipping_city, order.state].filter(Boolean).join(', ') || 'Nigeria',
      masked_email: maskedEmail,
      activity_log: order.activity_log || [],
      items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        attributes: item.attributes
      }))
    }

    return new Response(JSON.stringify({ found: true, order: sanitizedOrder }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('Track Order Function Exception:', err)
    return new Response(JSON.stringify({ error: err.message || 'Tracking service unavailable' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
