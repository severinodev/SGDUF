const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
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
  method: {
    type: DataTypes.ENUM('cash', 'card', 'transfer', 'mixed'),
    allowNull: false,
    defaultValue: 'cash'
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  change_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  reference: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'payments'
});

module.exports = Payment;
