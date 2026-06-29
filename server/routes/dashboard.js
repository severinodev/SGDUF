const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, roleCheck('admin', 'gerente'), dashboardController.dashboard);

module.exports = router;
