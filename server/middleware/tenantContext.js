const sequelize = require('../config/database');
const { namespace } = sequelize;

module.exports = (req, res, next) => {
  if (namespace) {
    namespace.run(new Map(), () => next());
  } else {
    next();
  }
};
