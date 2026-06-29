const router = require('express').Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck('admin'), purchaseController.create);
router.get('/', auth, roleCheck('admin', 'gerente'), purchaseController.getAll);
router.get('/:id', auth, purchaseController.getById);

module.exports = router;
