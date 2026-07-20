const { User, Product, Tenant } = require('../models');

exports.checkUserLimit = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada.' });

    const limits = {
      'free': 2,
      'professional': 15,
      'enterprise': Infinity
    };

    const maxUsers = limits[tenant.plan] || 2;
    const currentUserCount = await User.count({ where: { tenant_id: tenant.id } });

    if (currentUserCount >= maxUsers) {
      return res.status(400).json({ 
        message: `Límite alcanzado. Tu plan actual (${tenant.plan.toUpperCase()}) solo permite un máximo de ${maxUsers} usuarios. Mejora tu plan en la sección Mi Farmacia.` 
      });
    }

    next();
  } catch (error) {
    console.error('User limit validation error:', error);
    res.status(500).json({ message: 'Error al validar límites de usuario.' });
  }
};

exports.checkProductLimit = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada.' });

    const limits = {
      'free': 50,
      'professional': Infinity,
      'enterprise': Infinity
    };

    const maxProducts = limits[tenant.plan] || 50;
    const currentProductCount = await Product.count({ where: { tenant_id: tenant.id, active: true } });

    if (currentProductCount >= maxProducts) {
      return res.status(400).json({ 
        message: `Límite alcanzado. Tu plan actual (${tenant.plan.toUpperCase()}) solo permite un máximo de ${maxProducts} productos. Mejora tu plan en la sección Mi Farmacia.` 
      });
    }

    next();
  } catch (error) {
    console.error('Product limit validation error:', error);
    res.status(500).json({ message: 'Error al validar límites de productos.' });
  }
};

exports.checkReportAccess = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada.' });

    if (tenant.plan === 'free') {
      return res.status(403).json({ 
        message: 'Acceso denegado. Los reportes avanzados están disponibles en los planes Professional y Enterprise. Mejora tu plan en la sección Mi Farmacia.' 
      });
    }

    next();
  } catch (error) {
    console.error('Report access validation error:', error);
    res.status(500).json({ message: 'Error al validar acceso a reportes.' });
  }
};
