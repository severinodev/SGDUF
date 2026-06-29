import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await api.get('/categories'); setCategories(res.data); } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/categories/${editing.id}`, form); }
      else { await api.post('/categories', form); }
      setShowModal(false); setEditing(null); setForm({ name: '', description: '' }); load();
      setMessage({ type: 'success', text: editing ? 'Categoría actualizada' : 'Categoría creada' });
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try { await api.delete(`/categories/${id}`); load(); setMessage({ type: 'success', text: 'Categoría eliminada' }); }
    catch (err) { setMessage({ type: 'error', text: 'Error al eliminar' }); }
  };

  return (
    <>
      <Header title="Categorías" subtitle="Gestión de categorías" />
      <div className="page-header">
        <div><h1>Gestión de Categorías</h1><p>Organizar productos por categoría</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); }}><FiPlus /> Nueva Categoría</button>
      </div>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                <td>{c.description || '—'}</td>
                <td>
                  <div className="toolbar">
                    <button className="btn btn-sm btn-ghost" onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setShowModal(true); }}><FiEdit2 /></button>
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
            <div className="modal-header"><h2>{editing ? 'Editar' : 'Nueva'} Categoría</h2><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Descripción</label><textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Guardar</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
