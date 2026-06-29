const router = require('express').Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

router.get('/', auth, clientController.getAll);
router.get('/:id', auth, clientController.getById);
router.post('/', auth, clientController.create);
router.put('/:id', auth, clientController.update);
router.delete('/:id', auth, clientController.delete);

module.exports = router;
