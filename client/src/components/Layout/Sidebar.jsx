import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiPackage, FiGrid, FiAlertTriangle, FiClock,
  FiShoppingCart, FiUsers, FiRotateCcw, FiDollarSign,
  FiCreditCard, FiFileText, FiBarChart2, FiTruck,
  FiLogOut, FiBox
} from 'react-icons/fi';

const navItems = {
  admin: [
    { section: 'Principal', items: [
      { to: '/', icon: FiHome, label: 'Dashboard' },
    ]},
    { section: 'Inventario', items: [
      { to: '/productos', icon: FiPackage, label: 'Medicamentos' },
      { to: '/categorias', icon: FiGrid, label: 'Categorías' },
      { to: '/stock-bajo', icon: FiAlertTriangle, label: 'Alertas Stock' },
      { to: '/por-vencer', icon: FiClock, label: 'Por Vencer' },
    ]},
    { section: 'Ventas', items: [
      { to: '/nueva-venta', icon: FiShoppingCart, label: 'Nueva Venta' },
      { to: '/ventas', icon: FiFileText, label: 'Historial Ventas' },
      { to: '/clientes', icon: FiUsers, label: 'Clientes' },
      { to: '/devoluciones', icon: FiRotateCcw, label: 'Devoluciones' },
    ]},
    { section: 'Pagos', items: [
      { to: '/caja', icon: FiDollarSign, label: 'Caja' },
      { to: '/comprobantes', icon: FiCreditCard, label: 'Comprobantes' },
      { to: '/proveedores', icon: FiTruck, label: 'Proveedores' },
    ]},
    { section: 'Reportes', items: [
      { to: '/reportes', icon: FiBarChart2, label: 'Reportes' },
    ]},
  ],
  gerente: [
    { section: 'Principal', items: [
      { to: '/', icon: FiHome, label: 'Dashboard' },
    ]},
    { section: 'Inventario', items: [
      { to: '/productos', icon: FiPackage, label: 'Medicamentos' },
      { to: '/stock-bajo', icon: FiAlertTriangle, label: 'Alertas Stock' },
      { to: '/por-vencer', icon: FiClock, label: 'Por Vencer' },
    ]},
    { section: 'Reportes', items: [
      { to: '/reportes', icon: FiBarChart2, label: 'Reportes' },
      { to: '/ventas', icon: FiFileText, label: 'Historial Ventas' },
    ]},
  ],
  cajero: [
    { section: 'Principal', items: [
      { to: '/nueva-venta', icon: FiShoppingCart, label: 'Nueva Venta' },
    ]},
    { section: 'Ventas', items: [
      { to: '/ventas', icon: FiFileText, label: 'Mis Ventas' },
      { to: '/clientes', icon: FiUsers, label: 'Clientes' },
    ]},
    { section: 'Pagos', items: [
      { to: '/caja', icon: FiDollarSign, label: 'Caja' },
      { to: '/comprobantes', icon: FiCreditCard, label: 'Comprobantes' },
    ]},
  ],
};

export default function Sidebar() {
  const { user, tenant, logout } = useAuth();
  const location = useLocation();

  const sections = navItems[user?.role] || navItems.cajero;
  
  // Add Settings for admin
  const activeSections = [...sections];
  if (user?.role === 'admin' && !activeSections.find(s => s.section === 'Configuración')) {
    activeSections.push({
      section: 'Configuración', items: [
        { to: '/settings', icon: FiBox, label: 'Mi Farmacia' }
      ]
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {tenant?.name?.charAt(0)?.toUpperCase() || <FiBox />}
        </div>
        <div className="sidebar-brand">
          <h1>{tenant?.name || 'SGDUF'}</h1>
          <span>{tenant?.plan === 'professional' ? 'PRO' : 'Gestión Farmacéutica'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {activeSections.map((section) => (
          <div className="sidebar-section" key={section.section}>
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive && (item.to === '/' ? location.pathname === '/' : true) ? 'active' : ''}`
                }
                end={item.to === '/'}
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
