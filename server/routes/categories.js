const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, categoryController.getAll);
router.get('/:id', auth, categoryController.getById);
router.post('/', auth, roleCheck('admin'), categoryController.create);
router.put('/:id', auth, roleCheck('admin'), categoryController.update);
router.delete('/:id', auth, roleCheck('admin'), categoryController.delete);

module.exports = router;
