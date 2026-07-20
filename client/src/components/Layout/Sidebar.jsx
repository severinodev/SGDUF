import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiPackage, FiGrid, FiAlertTriangle, FiClock,
  FiShoppingCart, FiUsers, FiRotateCcw, FiDollarSign,
  FiCreditCard, FiFileText, FiBarChart2, FiTruck,
  FiLogOut, FiBox, FiUserPlus
} from 'react-icons/fi';

const navItems = {
  admin: [
    { section: 'Principal', items: [
      { to: '/dashboard', icon: FiHome, label: 'Dashboard', end: true },
    ]},
    { section: 'Inventario', items: [
      { to: '/dashboard/productos',  icon: FiPackage,      label: 'Medicamentos' },
      { to: '/dashboard/categorias', icon: FiGrid,         label: 'Categorías' },
      { to: '/dashboard/stock-bajo', icon: FiAlertTriangle,label: 'Alertas Stock' },
      { to: '/dashboard/por-vencer', icon: FiClock,        label: 'Por Vencer' },
    ]},
    { section: 'Ventas', items: [
      { to: '/dashboard/nueva-venta', icon: FiShoppingCart, label: 'Nueva Venta' },
      { to: '/dashboard/ventas',      icon: FiFileText,     label: 'Historial Ventas' },
      { to: '/dashboard/clientes',    icon: FiUsers,        label: 'Clientes' },
      { to: '/dashboard/devoluciones',icon: FiRotateCcw,    label: 'Devoluciones' },
    ]},
    { section: 'Pagos', items: [
      { to: '/dashboard/caja',        icon: FiDollarSign,  label: 'Caja' },
      { to: '/dashboard/comprobantes',icon: FiCreditCard,  label: 'Comprobantes' },
      { to: '/dashboard/proveedores', icon: FiTruck,       label: 'Proveedores' },
    ]},
    { section: 'Reportes', items: [
      { to: '/dashboard/reportes', icon: FiBarChart2, label: 'Reportes' },
    ]},
    { section: 'Administración', items: [
      { to: '/dashboard/usuarios', icon: FiUserPlus, label: 'Usuarios' },
      { to: '/dashboard/settings', icon: FiBox,      label: 'Mi Farmacia' },
    ]},
  ],
  gerente: [
    { section: 'Principal', items: [
      { to: '/dashboard', icon: FiHome, label: 'Dashboard', end: true },
    ]},
    { section: 'Inventario', items: [
      { to: '/dashboard/productos',  icon: FiPackage,      label: 'Medicamentos' },
      { to: '/dashboard/stock-bajo', icon: FiAlertTriangle,label: 'Alertas Stock' },
      { to: '/dashboard/por-vencer', icon: FiClock,        label: 'Por Vencer' },
    ]},
    { section: 'Reportes', items: [
      { to: '/dashboard/reportes', icon: FiBarChart2, label: 'Reportes' },
      { to: '/dashboard/ventas',   icon: FiFileText,  label: 'Historial Ventas' },
    ]},
  ],
  cajero: [
    { section: 'Principal', items: [
      { to: '/dashboard/nueva-venta', icon: FiShoppingCart, label: 'Nueva Venta' },
    ]},
    { section: 'Ventas', items: [
      { to: '/dashboard/ventas',   icon: FiFileText,  label: 'Mis Ventas' },
      { to: '/dashboard/clientes', icon: FiUsers,     label: 'Clientes' },
    ]},
    { section: 'Pagos', items: [
      { to: '/dashboard/caja',        icon: FiDollarSign, label: 'Caja' },
      { to: '/dashboard/comprobantes',icon: FiCreditCard, label: 'Comprobantes' },
    ]},
  ],
};

export default function Sidebar() {
  const { user, tenant, logout } = useAuth();

  const sections = navItems[user?.role] || navItems.cajero;

  const planLabel = {
    free: 'Plan Gratis',
    professional: 'Plan PRO',
    enterprise: 'Enterprise',
  }[tenant?.plan] || 'SGDUF';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {tenant?.name?.charAt(0)?.toUpperCase() || <FiBox />}
        </div>
        <div className="sidebar-brand">
          <h1>{tenant?.name || 'SGDUF'}</h1>
          <span>{planLabel}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div className="sidebar-section" key={section.section}>
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end ?? false}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={logout}>
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
          <FiLogOut style={{ color: 'var(--text-muted)', fontSize: 16 }} />
        </div>
      </div>
    </aside>
  );
}
