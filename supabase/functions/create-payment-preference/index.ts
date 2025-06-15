
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount = 65.00, title = "Pago de cuota" } = await req.json();

    const accessToken = "TEST-4917101840137683-061503-5ff0359d778336bd9985af07b2323238-519329860";
    
    const preferenceData = {
      items: [
        {
          title: title,
          quantity: 1,
          unit_price: amount,
          currency_id: "PEN"
        }
      ],
      back_urls: {
        success: `${req.headers.get('origin')}/pagar/exito`,
        failure: `${req.headers.get('origin')}/pagar/tarjeta`,
        pending: `${req.headers.get('origin')}/pagar/tarjeta`
      },
      auto_return: "approved",
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
          { id: "bank_transfer" },
          { id: "atm" }
        ],
        installments: 12,
        default_installments: 1
      },
      payer: {
        name: "Test User",
        surname: "Test",
        email: "test@test.com"
      },
      external_reference: `payment_${Date.now()}`,
      notification_url: null
    };

    console.log('Creating MercadoPago preference with data:', preferenceData);

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MercadoPago API Error:', errorText);
      throw new Error(`MercadoPago API Error: ${response.status} - ${errorText}`);
    }

    const preference = await response.json();
    console.log('MercadoPago preference created:', preference);

    return new Response(
      JSON.stringify({
        id: preference.id,
        init_point: preference.sandbox_init_point,
        sandbox_init_point: preference.sandbox_init_point
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error creating payment preference:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
