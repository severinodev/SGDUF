import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiBell } from 'react-icons/fi';
import api from '../../services/api';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    loadNotifications();
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/dashboard/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

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
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className="btn btn-icon btn-ghost notif-badge" 
            data-count={notifications.length}
            onClick={() => setShowNotif(!showNotif)}
            style={{ opacity: notifications.length === 0 ? 0.7 : 1 }}
          >
            <FiBell />
          </button>
          
          {showNotif && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: 320,
              marginTop: 10,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              maxHeight: 400,
              overflowY: 'auto'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-secondary)', fontWeight: 600 }}>
                Notificaciones ({notifications.length})
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No hay notificaciones
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-secondary)',
                    fontSize: 13,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}>
                    <div style={{ 
                      color: n.type === 'danger' ? 'var(--danger-400)' : 'var(--warning-400)',
                      fontWeight: 600 
                    }}>
                      {n.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
