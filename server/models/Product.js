const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  generic_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  sanitary_registration: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sanitary_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'categories', key: 'id' }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  min_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  expiration_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  batch_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  presentation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  laboratory: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products'
});

module.exports = Product;
