const router = require('express').Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { checkReportAccess } = require('../middleware/limitCheck');

router.get('/sales', auth, roleCheck('admin', 'gerente'), reportController.salesReport);
router.get('/inventory', auth, roleCheck('admin', 'gerente'), checkReportAccess, reportController.inventoryReport);
router.get('/expiring', auth, roleCheck('admin', 'gerente'), checkReportAccess, reportController.expiringReport);
router.get('/top-products', auth, roleCheck('admin', 'gerente'), checkReportAccess, reportController.topProductsReport);
router.get('/purchases', auth, roleCheck('admin', 'gerente'), checkReportAccess, reportController.purchasesReport);

module.exports = router;
