# Farmasys - Drugstore/Pharmacy Management System

A comprehensive web system for the complete management of a drugstore or pharmacy.

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite, React Router v7, Recharts, React Icons
- **Backend:** Node.js + Express.js, JWT Authentication, Sequelize ORM
- **Database:** PostgreSQL

## 📋 Modules

| Module | Features |
|--------|----------|
| **Inventory** | Medicine registration, sanitary registration verification, stock control, minimum stock alerts, expiration control, category management |
| **Sales** | Point of Sale (POS), fast search, discounts, customer management, sales history by seller, returns |
| **Payments** | Payment method registration, automatic change calculation, partial/mixed payments, supplier payments |
| **Receipts** | Receipt generation, automatic tax (VAT) calculation, local numbering, PDF export |
| **Reports** | Manager dashboard, sales reports, inventory reports, expiring products, best sellers, purchases |

## 👥 Roles

- **Admin:** Full access to the system
- **Manager:** Dashboard, reports, inventory (read-only)
- **Cashier/Seller:** POS, sales, register/cash control, receipts

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ or Docker Desktop

### 1. Database Setup

Using PostgreSQL locally, create the database:
```sql
CREATE DATABASE farmasys;
```
Or use Docker Desktop to spin up the database container:
```bash
docker-compose up -d db
```

### 2. Environment Variables

Create/configure the `.env` file in the project root:
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
```

### 3. Backend Setup

```bash
cd server
npm install
```

### 4. Frontend Setup

```bash
cd client
npm install
```

### 5. Seeding Initial Data

Run the seed command to populate the database with categories, products, and default users:
```bash
cd server
npm run seed
```

### 6. Running the Application

**Option A: Local Development**

In Terminal 1 (Backend):
```bash
cd server
npm run dev
```

In Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Open **`http://localhost:3000`** in your browser.

**Option B: Full Docker Deployment**
If you want to run the whole application stack via Docker, start Docker Desktop and run:
```bash
docker-compose up --build
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@farmasys.com | admin123 |
| Manager | gerente@farmasys.com | gerente123 |
| Cashier | cajero@farmasys.com | cajero123 |

---

## 🌐 Production Deployment

### Backend (e.g., Render)
1. Deploy the `server/` directory as a Web Service.
2. Set the following Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your production database URI (e.g., Neon PostgreSQL).
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`).
   - `JWT_SECRET`: A secure production secret key.
3. Access the **Shell ⚡** tab in Render and run:
   ```bash
   npm run seed
   ```

### Frontend (e.g., Vercel)
1. Deploy the `client/` directory as a Frontend project.
2. Configure the following Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api` (replace with your Render backend URL).
3. Redeploy the project so Vite compiles with the correct production URL.

---

## 📁 Directory Structure

```
Farmasys/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Common Layout (Sidebar, Header, MainLayout)
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Pages divided by modules (Auth, Ventas, etc.)
│   │   ├── services/        # API calls (axios setup)
│   │   ├── App.jsx          # Main Router
│   │   └── index.css        # Design System (dark medical theme)
│   └── vite.config.js
├── server/                  # Node.js + Express Backend
│   ├── config/              # Database connection configuration
│   ├── controllers/         # Business logic
│   ├── middleware/          # Security & Authentication guards
│   ├── models/              # Sequelize database models
│   ├── routes/              # Express API endpoints
│   ├── seeders/             # Initial mock data seeder
│   └── server.js            # App entry point
└── .env                     # Environment variables
```
