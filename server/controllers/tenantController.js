const { Tenant } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada.' });
    res.json(tenant);
  } catch (error) {
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
