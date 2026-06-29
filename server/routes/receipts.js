const router = require('express').Router();
const receiptController = require('../controllers/receiptController');
const auth = require('../middleware/auth');

router.get('/', auth, receiptController.getAll);
router.get('/:id', auth, receiptController.getById);
router.get('/:id/pdf', auth, receiptController.exportPDF);

module.exports = router;
