const router = require('express').Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, productController.getAll);
router.get('/search', auth, productController.search);
router.get('/low-stock', auth, roleCheck('admin', 'gerente'), productController.getLowStock);
router.get('/expiring', auth, roleCheck('admin', 'gerente'), productController.getExpiring);
router.get('/:id', auth, productController.getById);
router.post('/', auth, roleCheck('admin'), productController.create);
router.put('/:id', auth, roleCheck('admin'), productController.update);
router.delete('/:id', auth, roleCheck('admin'), productController.delete);

module.exports = router;
