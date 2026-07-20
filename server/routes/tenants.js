const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/me', auth, tenantController.getMe);
router.put('/me', auth, roleCheck('admin'), tenantController.updateSettings);

module.exports = router;
