require('dotenv').config({ path: '../.env' });
const { Sequelize } = require('sequelize');
const { AsyncLocalStorage } = require('async_hooks');

const storage = new AsyncLocalStorage();
const namespace = {
  run: (store, fn) => {
    if (typeof store === 'function') {
      return storage.run(new Map(), store);
    }
    return storage.run(store, fn);
  },
  bind: (fn) => fn,
  get: (key) => {
    const store = storage.getStore();
    return store ? store.get(key) : undefined;
  },
  set: (key, value) => {
    const store = storage.getStore();
    if (store) store.set(key, value);
    return value;
  },
  getStore: () => storage.getStore() // Keep for our middleware check
};

Sequelize.useCLS(namespace);

const isProduction = process.env.NODE_ENV === 'production';

// Production: use DATABASE_URL (Neon/Render provides this)
// Development: use individual env vars
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: isProduction ? 5 : 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'farmasys',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );

sequelize.namespace = namespace;
module.exports = sequelize;
