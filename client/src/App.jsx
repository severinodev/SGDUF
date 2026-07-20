import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Inventario/Products';
import Categories from './pages/Inventario/Categories';
import StockAlerts from './pages/Inventario/StockAlerts';
import ExpiringProducts from './pages/Inventario/ExpiringProducts';
import NewSale from './pages/Ventas/NewSale';
import SalesHistory from './pages/Ventas/SalesHistory';
import Returns from './pages/Ventas/Returns';
import Clients from './pages/Ventas/Clients';
import CashRegister from './pages/Pagos/CashRegister';
import Suppliers from './pages/Pagos/Suppliers';
import Receipts from './pages/Comprobantes/Receipts';
import Reports from './pages/Reportes/Reports';
import RegisterTenant from './pages/Auth/RegisterTenant';
import Settings from './pages/Settings/Settings';
import Landing from './pages/Landing/Landing';
import Usuarios from './pages/Usuarios/Usuarios';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}

function DashboardOrRedirect() {
  const { user } = useAuth();
  if (user?.role === 'cajero') return <Navigate to="/dashboard/nueva-venta" replace />;
  return <Dashboard />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterTenant />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Dashboard - admin & gerente */}
        <Route index element={<DashboardOrRedirect />} />

        {/* Inventario */}
        <Route path="productos" element={
          <ProtectedRoute roles={['admin', 'gerente']}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="categorias" element={
          <ProtectedRoute roles={['admin']}>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="stock-bajo" element={
          <ProtectedRoute roles={['admin', 'gerente']}>
            <StockAlerts />
          </ProtectedRoute>
        } />
        <Route path="por-vencer" element={
          <ProtectedRoute roles={['admin', 'gerente']}>
            <ExpiringProducts />
          </ProtectedRoute>
        } />

        {/* Ventas */}
        <Route path="nueva-venta" element={
          <ProtectedRoute roles={['admin', 'cajero']}>
            <NewSale />
          </ProtectedRoute>
        } />
        <Route path="ventas" element={<SalesHistory />} />
        <Route path="devoluciones" element={
          <ProtectedRoute roles={['admin']}>
            <Returns />
          </ProtectedRoute>
        } />
        <Route path="clientes" element={<Clients />} />

        {/* Pagos */}
        <Route path="caja" element={
          <ProtectedRoute roles={['admin', 'cajero']}>
            <CashRegister />
          </ProtectedRoute>
        } />
        <Route path="proveedores" element={
          <ProtectedRoute roles={['admin']}>
            <Suppliers />
          </ProtectedRoute>
        } />

        {/* Comprobantes */}
        <Route path="comprobantes" element={<Receipts />} />

        {/* Reportes */}
        <Route path="reportes" element={
          <ProtectedRoute roles={['admin', 'gerente']}>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Settings (Admin) */}
        <Route path="settings" element={
          <ProtectedRoute roles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Gestión de Usuarios (Admin) */}
        <Route path="usuarios" element={
          <ProtectedRoute roles={['admin']}>
            <Usuarios />
          </ProtectedRoute>
        } />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
