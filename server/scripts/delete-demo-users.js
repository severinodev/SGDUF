const { User } = require('../models');

async function clean() {
  try {
    const deletedCount = await User.destroy({
      where: {
        email: ['admin@sgduf.com', 'gerente@sgduf.com', 'cajero@sgduf.com']
      }
    });
    console.log(`✅ Eliminados ${deletedCount} usuarios demo.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    process.exit(1);
  }
}

clean();
