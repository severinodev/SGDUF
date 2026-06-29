const router = require('express').Router();
const cashRegisterController = require('../controllers/cashRegisterController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/open', auth, roleCheck('admin', 'cajero'), cashRegisterController.open);
router.put('/close', auth, roleCheck('admin', 'cajero'), cashRegisterController.close);
router.get('/current', auth, cashRegisterController.getCurrent);
router.get('/history', auth, roleCheck('admin', 'gerente'), cashRegisterController.getHistory);

module.exports = router;
