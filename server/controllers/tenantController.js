const { Tenant } = require('../models');

exports.getMe = async (req, res) => {
  try {
    let tenantId = req.user.tenant_id;
    
    // Self-healing for legacy/demo users without a tenant
    if (!tenantId) {
      const [defaultTenant] = await Tenant.findOrCreate({
        where: { slug: 'default' },
        defaults: {
          name: 'Mi Farmacia Demo',
          plan: 'free',
          status: 'active'
        }
      });
      
      // Update the user with the default tenant_id
      await req.user.update({ tenant_id: defaultTenant.id });
      tenantId = defaultTenant.id;
    }

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada.' });
    res.json(tenant);
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Error al obtener la organización.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { name, settings } = req.body;
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada.' });

    if (name) tenant.name = name;
    if (settings) {
      tenant.settings = { ...tenant.settings, ...settings };
    }
    
    await tenant.save();
    res.json({ message: 'Configuración actualizada.', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar configuración.' });
  }
};
