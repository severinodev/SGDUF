const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CashRegister = sequelize.define('CashRegister', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  opening_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  closing_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  total_sales: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  total_cash: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  total_card: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  total_transfer: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open'
  },
  opened_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cash_registers'
});

module.exports = CashRegister;
