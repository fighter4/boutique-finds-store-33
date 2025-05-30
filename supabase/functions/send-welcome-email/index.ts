
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName } = await req.json()

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { error: emailError } = await resend.emails.send({
      from: 'Your Store <welcome@yourdomain.com>',
      to: [email],
      subject: 'Welcome to Our Store!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to Our Store!</h1>
          
          <p>Dear ${firstName || 'Valued Customer'},</p>
          
          <p>Thank you for creating an account with us! We're excited to have you as part of our community.</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <p>🛍️ Browse our latest products</p>
            <p>💳 Enjoy secure checkout</p>
            <p>📦 Track your orders</p>
            <p>🎉 Get exclusive deals and offers</p>
          </div>

          <p>If you have any questions or need assistance, our customer service team is here to help.</p>
          
          <p>Happy shopping!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            You received this email because you created an account with us. 
            If this wasn't you, please contact our support team.
          </p>
        </div>
      `,
    })

    if (emailError) {
      throw emailError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Welcome email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
