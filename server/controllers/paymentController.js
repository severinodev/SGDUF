const crypto = require('crypto');
const { Tenant } = require('../models');
const { lemonSqueezySetup, createCheckout } = require('@lemonsqueezy/lemonsqueezy.js');

// Setup only if we have an API key (prevents crashing if missing)
if (process.env.LEMON_SQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    onError: (error) => console.error('Lemon Squeezy Error:', error),
  });
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const tenant = await Tenant.findByPk(req.user.tenant_id);

    const variantMap = {
      'starter': process.env.LEMON_VARIANT_STARTER || 'variant_starter',
      'professional': process.env.LEMON_VARIANT_PRO || 'variant_pro',
      'enterprise': process.env.LEMON_VARIANT_ENTERPRISE || 'variant_enterprise'
    };

    const variantId = variantMap[plan];
    if (!variantId) return res.status(400).json({ message: 'Plan no válido' });

    const storeId = process.env.LEMON_STORE_ID;
    if (!storeId) {
      throw new Error('LEMON_STORE_ID no configurado. Asegúrate de tener las variables de entorno.');
    }

    const newCheckout = {
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
      },
      checkoutData: {
        email: req.user.email,
        custom: {
          tenant_id: tenant.id.toString(),
        },
      },
      productOptions: {
        redirectUrl: `${process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000'}/settings?success=true`,
      }
    };

    const { statusCode, error, data } = await createCheckout(storeId, variantId, newCheckout);

    if (error) {
      console.error('Error creando checkout de Lemon Squeezy:', error);
      return res.status(500).json({ message: 'Error al iniciar el pago con Lemon Squeezy' });
    }

    res.json({ url: data.data.attributes.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Error interno al procesar el pago' });
  }
};

exports.webhook = async (req, res) => {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) return res.status(500).send('Webhook secret no configurado');

  const signature = req.headers['x-signature'];

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      throw new Error('Firma inválida.');
    }

    const payload = JSON.parse(req.body.toString());
    const eventName = payload.meta.event_name;
    const obj = payload.data.attributes;

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const tenantId = payload.meta.custom_data.tenant_id;
      
      await Tenant.update({
        lemon_customer_id: obj.customer_id.toString(),
        lemon_subscription_id: payload.data.id.toString(),
        plan: 'professional' // Aquí se podría actualizar basado en el variant_id pagado
      }, { where: { id: tenantId } });
    } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      const tenantId = payload.meta.custom_data.tenant_id;
      
      await Tenant.update({
        plan: 'free',
        status: 'active'
      }, { where: { id: tenantId } });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook Error');
  }
};
