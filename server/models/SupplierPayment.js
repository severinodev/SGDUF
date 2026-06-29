const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SupplierPayment = sequelize.define('SupplierPayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchase_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'purchases', key: 'id' }
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'suppliers', key: 'id' }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('cash', 'transfer', 'check'),
    allowNull: false,
    defaultValue: 'cash'
  },
  reference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'supplier_payments'
});

module.exports = SupplierPayment;
