const { Payment, SupplierPayment, Sale, Supplier, Purchase } = require('../models');

exports.getBySale = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { sale_id: req.params.saleId },
      include: [{ model: Sale, as: 'sale' }]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pagos.' });
  }
};

exports.createPartialPayment = async (req, res) => {
  try {
    const { sale_id, payments: paymentsList } = req.body;

    const sale = await Sale.findByPk(sale_id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada.' });

    const createdPayments = [];
    let totalPaid = 0;

    for (const p of paymentsList) {
      const payment = await Payment.create({
        sale_id,
        method: p.method,
        amount: p.amount,
        change_amount: p.change_amount || 0,
        reference: p.reference || null
      });
      createdPayments.push(payment);
      totalPaid += parseFloat(p.amount);
    }

    const changeAmount = Math.max(0, totalPaid - parseFloat(sale.total));

    res.status(201).json({
      message: 'Pagos registrados.',
      payments: createdPayments,
      totalPaid,
      change: changeAmount
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Error al registrar pagos.' });
  }
};

exports.createSupplierPayment = async (req, res) => {
  try {
    const { supplier_id, purchase_id, amount, method, reference, payment_date } = req.body;

    const supplier = await Supplier.findByPk(supplier_id);
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado.' });

    const payment = await SupplierPayment.create({
      purchase_id: purchase_id || null,
      supplier_id,
      amount,
      method: method || 'cash',
      reference,
      payment_date: payment_date || new Date()
    });

    res.status(201).json({ message: 'Pago a proveedor registrado.', payment });
  } catch (error) {
    console.error('Supplier payment error:', error);
    res.status(500).json({ message: 'Error al registrar pago a proveedor.' });
  }
};

exports.getSupplierPayments = async (req, res) => {
  try {
    const payments = await SupplierPayment.findAll({
      include: [
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] },
        { model: Purchase, as: 'purchase', attributes: ['id', 'invoice_number'] }
      ],
      order: [['payment_date', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pagos a proveedores.' });
  }
};
