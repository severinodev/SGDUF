const router = require('express').Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/sales', auth, roleCheck('admin', 'gerente'), reportController.salesReport);
router.get('/inventory', auth, roleCheck('admin', 'gerente'), reportController.inventoryReport);
router.get('/expiring', auth, roleCheck('admin', 'gerente'), reportController.expiringReport);
router.get('/top-products', auth, roleCheck('admin', 'gerente'), reportController.topProductsReport);
router.get('/purchases', auth, roleCheck('admin', 'gerente'), reportController.purchasesReport);

module.exports = router;
