const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { checkUserLimit } = require('../middleware/limitCheck');

router.post('/login', authController.login);
router.post('/register-tenant', authController.register); // Public: new org signup
router.post('/register', auth, roleCheck('admin'), checkUserLimit, authController.register); // Protected: admin adds users
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.get('/users', auth, roleCheck('admin'), authController.getUsers);
router.put('/users/:id', auth, roleCheck('admin'), authController.updateUser);
router.delete('/users/:id', auth, roleCheck('admin'), authController.deleteUser);

module.exports = router;
