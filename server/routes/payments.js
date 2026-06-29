const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/sale/:saleId', auth, paymentController.getBySale);
router.post('/partial', auth, paymentController.createPartialPayment);
router.post('/supplier', auth, paymentController.createSupplierPayment);
router.get('/supplier', auth, paymentController.getSupplierPayments);

module.exports = router;
