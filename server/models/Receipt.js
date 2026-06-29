const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Receipt = sequelize.define('Receipt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sale_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sales', key: 'id' }
  },
  receipt_number: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('factura', 'nota_venta'),
    allowNull: false,
    defaultValue: 'nota_venta'
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'receipts'
});

module.exports = Receipt;
