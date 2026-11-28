/**
 * LUSTRAX JEWELRIES - SUPABASE EDGE FUNCTIONS
 * 
 * send-order-notification: Unified notification dispatch system for
 * order placement (customer confirmation & admin alert) and lifecycle
 * fulfillment steps (confirmed -> processing -> shipped -> out_for_delivery -> delivered).
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "https://esm.sh/resend@3.2.0"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const resend = new Resend(RESEND_API_KEY)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// Brand email styling helpers
const BRAND_GOLD = '#D4AF37'
const BRAND_CHARCOAL = '#1A1A1A'
const BRAND_BG = '#FAFAFA'

const STATUS_DETAILS: Record<string, { title: string; subtitle: string; description: string; badgeColor: string }> = {
  pending: {
    title: 'Order Received',
    subtitle: 'Payment Awaiting Confirmation',
    description: 'We have received your order request and are awaiting final payment confirmation before crafting begins.',
    badgeColor: '#EAB308'
  },
  confirmed: {
    title: 'Order Confirmed',
    subtitle: 'Acquisition Verified & Secured',
    description: 'Your payment has been verified and your bespoke jewelry order is officially confirmed.',
    badgeColor: '#10B981'
  },
  processing: {
    title: 'Order in Preparation',
    subtitle: 'Crafting & Quality Verification',
    description: 'Our master jewelers are currently inspecting, preparing, and packaging your pieces with strict quality standards.',
    badgeColor: '#3B82F6'
  },
  shipped: {
    title: 'Order Shipped',
    subtitle: 'In Transit with Secure Courier',
    description: 'Your package has been securely sealed and handed over to our verified courier dispatch for transit.',
    badgeColor: '#8B5CF6'
  },
  out_for_delivery: {
    title: 'Out for Delivery',
    subtitle: 'Arriving at Your Destination Today',
    description: 'Our delivery courier is currently in your area with your order. Please keep your phone available.',
    badgeColor: '#F59E0B'
  },
  delivered: {
    title: 'Order Delivered',
    subtitle: 'Acquisition Successfully Completed',
    description: 'Your order has been safely delivered. We hope you cherish your Lustrax pieces for years to come.',
    badgeColor: '#059669'
  },
  cancelled: {
    title: 'Order Terminated',
    subtitle: 'Notice of Cancellation',
    description: 'Your order has been cancelled. Any pending refund or inquiry will be handled promptly by our concierge.',
    badgeColor: '#EF4444'
  }
}

function buildBaseEmailWrapper(content: string, preheader: string = 'Lustrax Jewelries Order Update') {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${preheader}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F4F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND_CHARCOAL};">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F4F4F5; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 30px 24px; border-bottom: 2px solid ${BRAND_GOLD}; background-color: #FFFFFF;">
                  <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: ${BRAND_CHARCOAL}; margin: 0 0 6px;">
                    Lustrax
                  </h1>
                  <p style="font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: ${BRAND_GOLD}; margin: 0;">
                    Fine Jewelries & Luxury Pieces
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px 30px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: ${BRAND_BG}; padding: 24px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #6B7280; margin: 0 0 6px; font-weight: 600;">
                    Lustrax Jewelries
                  </p>
                  <p style="font-size: 11px; color: #9CA3AF; margin: 0 0 12px; line-height: 1.5;">
                    Need concierge assistance? Reply directly to this email or reach us on WhatsApp.
                  </p>
                  <p style="font-size: 10px; color: #9CA3AF; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">
                    &copy; ${new Date().getFullYear()} Lustrax Jewelries. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function formatNaira(amount: number) {
  return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { 
      type, // 'order_placed', 'status_updated', 'admin_alert'
      order, 
      items = [], 
      customerEmail, 
      customerName = 'Valued Client', 
      customerPhone = '',
      shippingAddress = null,
      previousStatus = null,
      adminEmails = []
    } = payload

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order data required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const orderRef = (order.payment_reference || order.id || 'N/A').toString().toUpperCase()
    const orderTotal = formatNaira(order.total_amount)
    const formattedDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB')

    const itemsHtml = items.length > 0 ? `
      <div style="margin: 24px 0;">
        <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #4B5563; margin-bottom: 12px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px;">
          Ordered Items
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          ${items.map((item: any) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: ${BRAND_CHARCOAL};">
                <span style="font-weight: 600;">${item.product_name || item.name || 'Jewelry Piece'}</span>
                ${item.variant_name ? `<span style="font-size: 11px; color: #6B7280;"> (${item.variant_name})</span>` : ''}
                <div style="font-size: 11px; color: #9CA3AF;">Qty: ${item.quantity || item.qty || 1}</div>
              </td>
              <td align="right" style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; font-weight: 600; color: ${BRAND_CHARCOAL};">
                ${formatNaira((item.price || item.unit_price || 0) * (item.quantity || item.qty || 1))}
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    ` : ''

    const shippingHtml = shippingAddress ? `
      <div style="margin: 20px 0; padding: 16px; background-color: #F9FAFB; border-left: 3px solid ${BRAND_GOLD}; border-radius: 4px;">
        <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4B5563; margin: 0 0 6px;">
          Delivery Destination
        </p>
        <p style="font-size: 13px; color: ${BRAND_CHARCOAL}; margin: 0; line-height: 1.4;">
          ${typeof shippingAddress === 'string' ? shippingAddress : [
            shippingAddress.street,
            shippingAddress.landmark ? `(Near: ${shippingAddress.landmark})` : '',
            shippingAddress.area || shippingAddress.customArea,
            shippingAddress.city,
            shippingAddress.state
          ].filter(Boolean).join(', ')}
        </p>
        ${customerPhone ? `<p style="font-size: 12px; color: #6B7280; margin: 6px 0 0;">Contact: ${customerPhone}</p>` : ''}
      </div>
    ` : ''

    const dispatches = []

    // 1. ORDER PLACED (Customer Confirmation & Admin Notification)
    if (type === 'order_placed') {
      // A. Customer Confirmation
      if (customerEmail) {
        const customerBody = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 6px 16px; background-color: #ECFDF5; color: #065F46; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
              Order Confirmed
            </div>
            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: ${BRAND_CHARCOAL}; margin: 0 0 8px;">
              Thank you, ${customerName}
            </h2>
            <p style="font-size: 13px; color: #6B7280; margin: 0;">
              Your order has been received and confirmed. We are preparing your jewelry.
            </p>
          </div>

          <div style="background-color: #F9FAFB; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Order Reference:</span>
              <strong style="color: ${BRAND_CHARCOAL}; font-family: monospace;">#${orderRef}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Order Date:</span>
              <span style="color: ${BRAND_CHARCOAL};">${formattedDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount:</span>
              <strong style="color: ${BRAND_GOLD}; font-size: 14px;">${orderTotal}</strong>
            </div>
          </div>

          ${itemsHtml}
          ${shippingHtml}

          <div style="margin-top: 30px; padding: 16px; background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; text-align: center;">
            <p style="font-size: 12px; color: #92400E; margin: 0; line-height: 1.5;">
              <strong>What happens next?</strong><br>
              You will receive automated email updates as your jewelry moves from preparation to dispatch and delivery.
            </p>
          </div>
        `

        dispatches.push(
          resend.emails.send({
            from: 'Lustrax Jewelries <concierge@lustrax-jewelries.com>',
            to: [customerEmail],
            subject: `Order Confirmation #${orderRef} - Lustrax Jewelries`,
            html: buildBaseEmailWrapper(customerBody, `Order Confirmation #${orderRef}`)
          }).then(res => ({ target: 'customer', ...res }))
        )
      }

      // B. Admin Order Notification
      // Primary store owner/client email is ejehrhema1@gmail.com, developer admin is udohknowledge5@gmail.com
      const STORE_ADMINS = ['ejehrhema1@gmail.com', 'udohknowledge5@gmail.com']
      const adminTargets = Array.from(new Set([...STORE_ADMINS, ...adminEmails]))
      const adminBody = `
        <div style="margin-bottom: 24px;">
          <div style="display: inline-block; padding: 6px 14px; background-color: #FEF3C7; color: #92400E; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
            New Order Alert
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: ${BRAND_CHARCOAL}; margin: 0 0 8px;">
            New Order Placed: #${orderRef}
          </h2>
          <p style="font-size: 13px; color: #6B7280; margin: 0;">
            A new client order has been placed and verified via Paystack.
          </p>
        </div>

        <div style="background-color: #F9FAFB; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px; font-size: 12px;">
          <p style="margin: 0 0 6px;"><strong>Customer:</strong> ${customerName} (${customerEmail || 'No email'})</p>
          <p style="margin: 0 0 6px;"><strong>Phone:</strong> ${customerPhone || 'N/A'}</p>
          <p style="margin: 0 0 6px;"><strong>Reference:</strong> #${orderRef}</p>
          <p style="margin: 0 0 6px;"><strong>Total Revenue:</strong> <span style="color: ${BRAND_GOLD}; font-weight: bold; font-size: 14px;">${orderTotal}</span></p>
          <p style="margin: 0;"><strong>Date:</strong> ${formattedDate}</p>
        </div>

        ${itemsHtml}
        ${shippingHtml}

        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 12px; color: #6B7280; margin-bottom: 12px;">Review and manage fulfillment in the Admin Dashboard:</p>
          <a href="https://lustrax-jewelries.com/admin/orders?search=${orderRef}" style="display: inline-block; background-color: ${BRAND_CHARCOAL}; color: #FFFFFF; padding: 12px 24px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; border-radius: 4px;">
            Open Order in Admin Portal &rarr;
          </a>
        </div>
      `

      dispatches.push(
        resend.emails.send({
          from: 'Lustrax Concierge Alert <concierge@lustrax-jewelries.com>',
          to: adminTargets,
          subject: `[NEW ORDER] ${orderTotal} from ${customerName} (#${orderRef})`,
          html: buildBaseEmailWrapper(adminBody, `New Order Received #${orderRef}`)
        }).then(res => ({ target: 'admin', ...res }))
      )
    }

    // 2. ORDER STATUS UPDATED (Customer Progress Notification)
    if (type === 'status_updated') {
      const newStatus = order.status || 'confirmed'
      const statusInfo = STATUS_DETAILS[newStatus] || {
        title: `Order Status: ${newStatus.toUpperCase()}`,
        subtitle: 'Status Update',
        description: `Your order status has been updated to ${newStatus.toUpperCase()}.`,
        badgeColor: BRAND_GOLD
      }

      if (customerEmail) {
        const statusBody = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 6px 16px; background-color: ${statusInfo.badgeColor}15; color: ${statusInfo.badgeColor}; border: 1px solid ${statusInfo.badgeColor}30; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
              ${statusInfo.subtitle}
            </div>
            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: ${BRAND_CHARCOAL}; margin: 0 0 10px;">
              ${statusInfo.title}
            </h2>
            <p style="font-size: 14px; color: #4B5563; line-height: 1.6; max-width: 480px; margin: 0 auto;">
              ${statusInfo.description}
            </p>
          </div>

          <!-- Progress Stepper -->
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 6px; margin-bottom: 26px;">
            <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #9CA3AF; margin: 0 0 14px; text-align: center;">
              Fulfillment Journey
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align: center; font-size: 11px;">
              <tr>
                ${['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map((step, idx, arr) => {
                  const stepOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']
                  const currentIdx = stepOrder.indexOf(newStatus)
                  const thisIdx = stepOrder.indexOf(step)
                  const isDone = thisIdx <= currentIdx
                  const isCurrent = step === newStatus

                  return `
                    <td style="padding: 4px 2px;">
                      <div style="width: 22px; height: 22px; border-radius: 50%; margin: 0 auto 6px; line-height: 22px; font-size: 10px; font-weight: bold; background-color: ${isCurrent ? BRAND_GOLD : (isDone ? BRAND_CHARCOAL : '#E5E7EB')}; color: ${isDone || isCurrent ? '#FFFFFF' : '#9CA3AF'};">
                        ${isDone && !isCurrent ? '✓' : idx + 1}
                      </div>
                      <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: ${isCurrent ? BRAND_CHARCOAL : (isDone ? '#4B5563' : '#9CA3AF')}; font-weight: ${isCurrent ? '700' : 'normal'};">
                        ${step.replace(/_/g, ' ')}
                      </span>
                    </td>
                  `
                }).join('')}
              </tr>
            </table>
          </div>

          <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Order Reference:</span>
              <strong style="color: ${BRAND_CHARCOAL}; font-family: monospace;">#${orderRef}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount:</span>
              <strong style="color: ${BRAND_GOLD}; font-size: 13px;">${orderTotal}</strong>
            </div>
          </div>

          ${itemsHtml}
          ${shippingHtml}

          <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 12px; color: #6B7280; margin-bottom: 12px;">Questions about your delivery schedule?</p>
            <a href="https://wa.me/2348160000000?text=Hello%20Lustrax,%20inquiry%20regarding%20order%20%23${orderRef}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; padding: 12px 24px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; border-radius: 4px;">
              Chat with Concierge &rarr;
            </a>
          </div>
        `

        dispatches.push(
          resend.emails.send({
            from: 'Lustrax Jewelries <concierge@lustrax-jewelries.com>',
            to: [customerEmail],
            subject: `Update: Your order is ${statusInfo.title} (#${orderRef})`,
            html: buildBaseEmailWrapper(statusBody, `Order Update #${orderRef}: ${statusInfo.title}`)
          }).then(res => ({ target: 'customer', ...res }))
        )
      }
    }

    const results = await Promise.allSettled(dispatches)

    return new Response(JSON.stringify({ success: true, dispatches: results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Order Notification Dispatch Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})