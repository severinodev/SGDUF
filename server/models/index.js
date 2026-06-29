const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Client = require('./Client');
const Supplier = require('./Supplier');
const Sale = require('./Sale');
const SaleDetail = require('./SaleDetail');
const Purchase = require('./Purchase');
const PurchaseDetail = require('./PurchaseDetail');
const Payment = require('./Payment');
const SupplierPayment = require('./SupplierPayment');
const Receipt = require('./Receipt');
const CashRegister = require('./CashRegister');

// ─── Associations ───

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User <-> Sale
User.hasMany(Sale, { foreignKey: 'user_id', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'user_id', as: 'seller' });

// Client <-> Sale
Client.hasMany(Sale, { foreignKey: 'client_id', as: 'sales' });
Sale.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Sale <-> SaleDetail
Sale.hasMany(SaleDetail, { foreignKey: 'sale_id', as: 'details' });
SaleDetail.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

// Product <-> SaleDetail
Product.hasMany(SaleDetail, { foreignKey: 'product_id', as: 'saleDetails' });
SaleDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Sale <-> Payment
Sale.hasMany(Payment, { foreignKey: 'sale_id', as: 'payments' });
Payment.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

// Sale <-> Receipt
Sale.hasOne(Receipt, { foreignKey: 'sale_id', as: 'receipt' });
Receipt.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

// Supplier <-> Purchase
Supplier.hasMany(Purchase, { foreignKey: 'supplier_id', as: 'purchases' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// User <-> Purchase
User.hasMany(Purchase, { foreignKey: 'user_id', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'user_id', as: 'registeredBy' });

// Purchase <-> PurchaseDetail
Purchase.hasMany(PurchaseDetail, { foreignKey: 'purchase_id', as: 'details' });
PurchaseDetail.belongsTo(Purchase, { foreignKey: 'purchase_id', as: 'purchase' });

// Product <-> PurchaseDetail
Product.hasMany(PurchaseDetail, { foreignKey: 'product_id', as: 'purchaseDetails' });
PurchaseDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Supplier <-> SupplierPayment
Supplier.hasMany(SupplierPayment, { foreignKey: 'supplier_id', as: 'payments' });
SupplierPayment.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// Purchase <-> SupplierPayment
Purchase.hasMany(SupplierPayment, { foreignKey: 'purchase_id', as: 'payments' });
SupplierPayment.belongsTo(Purchase, { foreignKey: 'purchase_id', as: 'purchase' });

// User <-> CashRegister
User.hasMany(CashRegister, { foreignKey: 'user_id', as: 'cashRegisters' });
CashRegister.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Client,
  Supplier,
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail,
  Payment,
  SupplierPayment,
  Receipt,
  CashRegister
};
