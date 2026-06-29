const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/login', authController.login);
router.post('/register', auth, roleCheck('admin'), authController.register);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.get('/users', auth, roleCheck('admin'), authController.getUsers);

module.exports = router;
