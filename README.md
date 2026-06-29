# SGDUF - Sistema de Gestión de Droguería/Farmacia

Sistema web completo para la gestión integral de una droguería o farmacia.

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite, React Router v6, Recharts, React Icons
- **Backend:** Node.js + Express.js, JWT Auth, Sequelize ORM
- **Base de datos:** PostgreSQL

## 📋 Módulos

| Módulo | Funcionalidades |
|--------|----------------|
| **Inventario** | Registro de medicamentos, verificación sanitaria, control de stock, alertas de stock mínimo, control de vencimientos, gestión de categorías |
| **Ventas** | Punto de venta (POS), búsqueda rápida, descuentos, gestión de clientes, historial de ventas por vendedor, devoluciones |
| **Pagos** | Registro de métodos de pago, cálculo de cambio, pago parcial/mixto, pagos a proveedores |
| **Comprobantes** | Generación de comprobantes, cálculo automático de IVA, numeración local, exportación PDF |
| **Reportes** | Dashboard gerencial, reporte de ventas, inventario, productos por vencer, más vendidos, compras |

## 👥 Roles

- **Admin:** Acceso total al sistema
- **Gerente:** Dashboard, reportes, inventario (lectura)
- **Cajero/Vendedor:** POS, ventas, caja, comprobantes

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+

### 1. Base de datos

```sql
CREATE DATABASE sgduf;
```

### 2. Backend

```bash
cd server
npm install
```

### 3. Frontend

```bash
cd client
npm install
```

### 4. Variables de entorno

Editar `.env` en la raíz del proyecto con tus credenciales de PostgreSQL.

### 5. Seed (datos iniciales)

```bash
cd server
npm run seed
```

### 6. Iniciar

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### 7. Acceder

Abrir `http://localhost:3000`

### Credenciales demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@sgduf.com | admin123 |
| Gerente | gerente@sgduf.com | gerente123 |
| Cajero | cajero@sgduf.com | cajero123 |

## 📁 Estructura

```
SGDUF/
├── client/                  # Frontend React + Vite
│   ├── src/
│   │   ├── components/      # Layout (Sidebar, Header)
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Páginas por módulo
│   │   ├── services/        # API (axios)
│   │   ├── App.jsx          # Router principal
│   │   └── index.css        # Design system
│   └── vite.config.js
├── server/                  # Backend Node.js + Express
│   ├── config/              # Database config
│   ├── controllers/         # Lógica de negocio
│   ├── middleware/           # Auth & Role check
│   ├── models/              # Modelos Sequelize
│   ├── routes/              # Rutas API REST
│   ├── seeders/             # Datos iniciales
│   └── server.js            # Entry point
└── .env                     # Variables de entorno
```
