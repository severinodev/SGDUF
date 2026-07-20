const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/create-checkout', auth, roleCheck('admin'), paymentController.createCheckoutSession);

router.post('/webhook', paymentController.webhook);

module.exports = router;
