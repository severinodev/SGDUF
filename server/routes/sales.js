const router = require('express').Router();
const saleController = require('../controllers/saleController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck('admin', 'cajero'), saleController.create);
router.get('/', auth, saleController.getAll);
router.get('/:id', auth, saleController.getById);
router.get('/seller/:id', auth, saleController.getBySeller);
router.post('/:id/return', auth, roleCheck('admin'), saleController.returnSale);

module.exports = router;
