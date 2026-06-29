import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiBell } from 'react-icons/fi';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <div className="header-title">{title || 'Dashboard'}</div>
          {subtitle && <div className="header-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="header-right">
        <div className="header-search">
          <FiSearch />
          <input type="text" placeholder="Buscar..." />
        </div>
        <button className="btn btn-icon btn-ghost notif-badge" data-count="3">
          <FiBell />
        </button>
      </div>
    </header>
  );
}
