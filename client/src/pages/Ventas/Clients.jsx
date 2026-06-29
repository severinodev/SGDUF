import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', document_id: '', phone: '', email: '', address: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => { load(); }, [search]);

  const load = async () => {
    try { const res = await api.get('/clients', { params: { search: search || undefined } }); setClients(res.data); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/clients/${editing.id}`, form); }
      else { await api.post('/clients', form); }
      setShowModal(false); setEditing(null); setForm({ name: '', document_id: '', phone: '', email: '', address: '' }); load();
      setMessage({ type: 'success', text: editing ? 'Cliente actualizado' : 'Cliente creado' });
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try { await api.delete(`/clients/${id}`); load(); } catch (err) { console.error(err); }
  };

  return (
    <>
      <Header title="Clientes" subtitle="Gestión de clientes" />
      <div className="page-header">
        <div><h1>Gestión de Clientes</h1><p>Administrar información de clientes</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', document_id: '', phone: '', email: '', address: '' }); setShowModal(true); }}><FiPlus /> Nuevo Cliente</button>
      </div>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Nombre</th><th>Documento</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th>Acciones</th></tr></thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                <td>{c.document_id || '—'}</td>
                <td>{c.phone || '—'}</td>
                <td>{c.email || '—'}</td>
                <td>{c.address || '—'}</td>
                <td>
                  <div className="toolbar">
                    <button className="btn btn-sm btn-ghost" onClick={() => { setEditing(c); setForm({ name: c.name, document_id: c.document_id || '', phone: c.phone || '', email: c.email || '', address: c.address || '' }); setShowModal(true); }}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-400)' }} onClick={() => handleDelete(c.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>{editing ? 'Editar' : 'Nuevo'} Cliente</h2><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Documento/Cédula</label><input className="form-input" value={form.document_id} onChange={e => setForm({...form, document_id: e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Teléfono</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Dirección</label><input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Guardar</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
