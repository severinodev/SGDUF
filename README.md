# Farmasys - Pharmacy and Drugstore Management System

Farmasys is a multi-tenant web platform for managing inventory, sales, suppliers, payments, reports, and subscriptions for pharmacies and drugstores in a unified way.

## ✨ New implementations included

The project already includes several important improvements and functional modules:

- Integration with the Lemon Squeezy payment gateway for subscriptions and premium plans.
- Subscription checkout from the tenant configuration interface.
- Webhooks to activate, update, and cancel plans automatically.
- Management of Professional and Enterprise plans with dynamic subscription changes.
- Multi-tenant architecture with isolation by company/tenant.
- JWT authentication and role-based access control (Admin, Manager, Cashier/Seller).
- Inventory management with categories, products, stock alerts, and expiring items.
- Point of sale (POS), sales, returns, and sales history.
- Supplier management and supplier payments.
- Cash register tracking, cash control, and mixed/partial payments.
- Receipt generation and PDF export for invoices/receipts.
- Dashboard and operational reports for sales and inventory monitoring.
- Docker deployment support for development and production environments.

## 🚀 Technology stack

- Frontend: React 18 + Vite + React Router + Recharts + React Icons
- Backend: Node.js + Express.js + Sequelize ORM + JWT
- Database: PostgreSQL
- Payments: Lemon Squeezy
- Document generation: PDFKit

## 📋 Main modules

| Module | Features |
|--------|----------|
| Inventory | Product registration, categories, stock control, alerts, expiry tracking, and inventory management |
| Sales | Point of sale, fast search, discounts, customers, returns, and sales history |
| Payments | Payment methods, automatic change calculation, partial/mixed payments, supplier payments, and subscriptions |
| Receipts | Receipt generation, automatic tax calculation, and PDF export |
| Reports | Executive dashboard, sales reports, inventory reports, top sellers, and purchases |
| Subscriptions | Professional/Enterprise plans, payment checkout, and automatic updates via webhooks |

## 👥 System roles

- Admin: full system access and company configuration.
- Manager: dashboard, reports, and inventory supervision permissions.
- Cashier/Seller: sales, point of sale, cash handling, and receipts.

## 🛠️ Prerequisites

- Node.js 18+
- PostgreSQL 14+ or Docker Desktop
- Environment variables configured correctly

## ⚙️ Configuration

### 1. Database

Create the database in PostgreSQL:

```sql
CREATE DATABASE farmasys;
```

Or start the database container with Docker:

```bash
docker-compose up -d db
```

### 2. Environment variables

Create the .env file in the project root with content similar to:

```env
# Server
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmasys
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
PORT=5000
TAX_RATE=0.12

# Client
VITE_API_URL=http://localhost:5000/api

# Payments - Lemon Squeezy
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_STORE_ID=your_store_id
LEMON_VARIANT_PRO=your_variant_professional
LEMON_VARIANT_ENTERPRISE=your_variant_enterprise
LEMON_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

### 4. Load initial data

```bash
cd server
npm run seed
```

### 5. Run the application

Option A - Local development:

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Open http://localhost:3000 in your browser.

Option B - Docker:

```bash
docker-compose up --build
```

## 🔐 Demo credentials

| Role | Email | Password |
|-----|-------|----------|
| Admin | admin@farmasys.com | admin123 |
| Manager | gerente@farmasys.com | gerente123 |
| Cashier | cajero@farmasys.com | cajero123 |

## 💳 Payments and subscription integration

The application includes a subscription flow managed by Lemon Squeezy:

- The administrator can start a checkout from the configuration section.
- The backend exposes the /api/payments/create-checkout endpoint to create the payment session.
- Lemon Squeezy webhooks automatically update the tenant plan and status.
- Plan changes are reflected immediately in the interface after completion.

## 🌐 Production deployment

### Backend (Render / Railway / VPS)
1. Deploy the server folder as a web service.
2. Configure production environment variables, including JWT_SECRET, DATABASE_URL, FRONTEND_URL, and Lemon Squeezy credentials.
3. Run the initial seed with:

```bash
npm run seed
```

### Frontend (Vercel)
1. Deploy the client folder as a frontend project.
2. Set the VITE_API_URL variable pointing to the published backend.
3. Redeploy to compile the application with the correct environment.

## 📁 Project structure

```text
Farmasys/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable layout and components
│   │   ├── context/         # AuthContext and global state
│   │   ├── pages/           # Authentication, sales, inventory, payments, reports, and configuration modules
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main routes
│   │   └── index.css        # System styles
│   └── vite.config.js
├── server/                  # Node.js + Express backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication, roles, and tenant context
│   ├── models/              # Sequelize models
│   ├── routes/              # API endpoints
│   ├── seeders/             # Initial seed data
│   └── server.js            # Server entry point
└── docker-compose.yml       # Service orchestration
```
