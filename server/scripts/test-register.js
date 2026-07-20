const { register } = require('../controllers/authController');

// Mock req and res
const req = {
  body: {
    tenant_name: 'Farmacia de Prueba',
    tenant_slug: 'farmacia-de-prueba-' + Date.now(),
    name: 'Administrador de Prueba',
    email: 'test' + Date.now() + '@gmail.com',
    password: 'password123'
  }
};

const res = {
  status(code) {
    console.log('Status code:', code);
    return this;
  },
  json(data) {
    console.log('Response JSON:', data);
    return this;
  }
};

async function test() {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Unhandled error caught in script:', error);
  }
}

test();
