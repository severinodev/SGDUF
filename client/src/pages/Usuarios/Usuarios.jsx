import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
  FiUser, FiMail, FiLock, FiShield
} from 'react-icons/fi';

const ROLE_LABELS = { admin: 'Admin', gerente: 'Gerente', cajero: 'Cajero' };
const ROLE_COLORS = {
  admin:   { bg: 'rgba(6,182,212,0.15)',    color: 'var(--primary-400)' },
  gerente: { bg: 'rgba(139,92,246,0.15)',   color: '#a78bfa' },
  cajero:  { bg: 'rgba(251,191,36,0.15)',   color: '#fbbf24' },
};

export default function Usuarios() {
  const { tenant } = useAuth();
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editUser, setEditUser]     = useState(null);   // null = create mode
  const [form, setForm]             = useState({ name: '', email: '', password: '', role: 'cajero' });
  const [error, setError]           = useState('');
  const [saving, setSaving]         = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'cajero' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editUser) {
        // Update existing user
        await api.put(`/auth/users/${editUser.id}`, {
          name: form.name,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });
      } else {
        // Create new user
        await api.post('/auth/register', form);
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u) => {
    try {
      await api.put(`/auth/users/${u.id}`, { active: !u.active });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar usuario.');
    }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`¿Eliminar al usuario "${u.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/auth/users/${u.id}`);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario.');
    }
  };

  const planLimits = { free: 2, professional: 15, enterprise: Infinity };
  const maxUsers   = planLimits[tenant?.plan] || 2;
  const atLimit    = users.length >= maxUsers;

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiUsers /> Gestión de Usuarios
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {users.length} / {maxUsers === Infinity ? '∞' : maxUsers} usuarios · Plan{' '}
            <span style={{ textTransform: 'capitalize', color: 'var(--primary-400)', fontWeight: 600 }}>{tenant?.plan}</span>
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreate}
          disabled={atLimit}
          title={atLimit ? `Límite de ${maxUsers} usuarios alcanzado. Mejora tu plan.` : ''}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <FiPlus /> Nuevo Usuario
        </button>
      </div>

      {atLimit && (
        <div style={{
          padding: '12px 16px', marginBottom: 24, borderRadius: 10,
          background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
          color: '#fbbf24', fontSize: 14
        }}>
          ⚠️ Has alcanzado el límite de <strong>{maxUsers} usuarios</strong> en tu plan actual.
          Mejora tu plan en <strong>Mi Farmacia</strong> para añadir más.
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>
      ) : (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                {['Usuario', 'Email', 'Rol', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--gradient-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: 'white', flexShrink: 0
                      }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: ROLE_COLORS[u.role]?.bg,
                      color: ROLE_COLORS[u.role]?.color,
                    }}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: u.active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      color: u.active ? 'var(--success-400, #34d399)' : '#f87171',
                    }}>
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        title="Editar"
                        onClick={() => openEdit(u)}
                        style={{ background: 'rgba(6,182,212,0.1)', border: 'none', borderRadius: 8, padding: '7px 10px', color: 'var(--primary-400)', cursor: 'pointer' }}
                      ><FiEdit2 size={14} /></button>
                      <button
                        title={u.active ? 'Desactivar' : 'Activar'}
                        onClick={() => toggleActive(u)}
                        style={{ background: u.active ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: 'none', borderRadius: 8, padding: '7px 10px', color: u.active ? '#f87171' : '#34d399', cursor: 'pointer' }}
                      >{u.active ? <FiX size={14} /> : <FiCheck size={14} />}</button>
                      <button
                        title="Eliminar"
                        onClick={() => deleteUser(u)}
                        style={{ background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: 8, padding: '7px 10px', color: '#f87171', cursor: 'pointer' }}
                      ><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No hay usuarios registrados aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 440, border: '1px solid var(--border-primary)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                {editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>
                <FiX />
              </button>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', marginBottom: 16, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 13, border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <FiUser size={13} /> Nombre completo
                  </label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: María González"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <FiMail size={13} /> Email
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="usuario@farmacia.com"
                    required
                    disabled={!!editUser}
                    style={{ opacity: editUser ? 0.6 : 1 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <FiLock size={13} /> {editUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  </label>
                  <input
                    className="form-input"
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={editUser ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
                    required={!editUser}
                    minLength={form.password ? 6 : undefined}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <FiShield size={13} /> Rol
                  </label>
                  <select
                    className="form-input"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="cajero">🛒 Cajero — solo ventas y caja</option>
                    <option value="gerente">📊 Gerente — inventario y reportes</option>
                    <option value="admin">⚙️ Admin — acceso completo</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={closeModal} className="btn" style={{ flex: 1, border: '1px solid var(--border-primary)' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Guardando...' : editUser ? 'Guardar cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
