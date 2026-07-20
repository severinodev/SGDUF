const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/create-checkout', auth, roleCheck('admin'), paymentController.createCheckoutSession);

// Webhook requires raw body for signature verification (express.raw is used to keep the body unparsed)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);

module.exports = router;
