import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', generic_name: '', sanitary_registration: '', category_id: '',
    price: '', cost: '', stock: '', min_stock: '10', expiration_date: '',
    batch_number: '', presentation: '', laboratory: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => { loadProducts(); loadCategories(); }, [page, search, categoryFilter]);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products', { params: { page, limit: 15, search, category_id: categoryFilter || undefined } });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try { const res = await api.get('/categories'); setCategories(res.data); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, form);
        setMessage({ type: 'success', text: 'Producto actualizado exitosamente' });
      } else {
        await api.post('/products', form);
        setMessage({ type: 'success', text: 'Medicamento registrado exitosamente' });
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al guardar' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage({ type: 'success', text: 'Producto eliminado' });
      loadProducts();
    } catch (err) { setMessage({ type: 'error', text: 'Error al eliminar' }); }
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name, generic_name: product.generic_name || '',
      sanitary_registration: product.sanitary_registration || '',
      category_id: product.category_id || '', price: product.price,
      cost: product.cost, stock: product.stock, min_stock: product.min_stock,
      expiration_date: product.expiration_date || '', batch_number: product.batch_number || '',
      presentation: product.presentation || '', laboratory: product.laboratory || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: '', generic_name: '', sanitary_registration: '', category_id: '',
      price: '', cost: '', stock: '', min_stock: '10', expiration_date: '',
      batch_number: '', presentation: '', laboratory: '' });
  };

  const isLowStock = (p) => p.stock <= p.min_stock;
  const isExpiring = (p) => {
    if (!p.expiration_date) return false;
    const days = (new Date(p.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 30;
  };

  return (
    <>
      <Header title="Medicamentos" subtitle="Gestión de inventario" />

      <div className="page-header">
        <div><h1>Gestión de Medicamentos</h1><p>Registrar, editar y controlar stock de productos</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}>
          <FiPlus /> Registrar Medicamento
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Buscar medicamento..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: 36 }} />
        </div>
        <select className="form-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Costo</th>
              <th>Stock</th>
              <th>Reg. Sanitario</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><div className="loading-spinner"><div className="spinner" /></div></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No se encontraron productos</td></tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.generic_name} · {p.presentation}</div>
                </td>
                <td>{p.category?.name || '—'}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-400)' }}>${parseFloat(p.price).toFixed(2)}</td>
                <td>${parseFloat(p.cost).toFixed(2)}</td>
                <td>
                  <span style={{ fontWeight: 600, color: isLowStock(p) ? 'var(--danger-400)' : 'var(--text-primary)' }}>
                    {p.stock}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> / mín: {p.min_stock}</span>
                </td>
                <td>
                  {p.sanitary_verified
                    ? <span className="badge badge-success"><FiCheck /> Verificado</span>
                    : <span className="badge badge-warning"><FiX /> Pendiente</span>}
                </td>
                <td>
                  {p.expiration_date ? (
                    <span style={{ color: isExpiring(p) ? 'var(--danger-400)' : 'var(--text-secondary)' }}>
                      {new Date(p.expiration_date).toLocaleDateString('es-ES')}
                    </span>
                  ) : '—'}
                </td>
                <td>
                  {isLowStock(p) && <span className="badge badge-danger"><FiAlertTriangle /> Stock Bajo</span>}
                  {isExpiring(p) && <span className="badge badge-warning" style={{ marginLeft: 4 }}>Por Vencer</span>}
                  {!isLowStock(p) && !isExpiring(p) && <span className="badge badge-success">Normal</span>}
                </td>
                <td>
                  <div className="toolbar">
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(p)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-ghost" onClick={() => handleDelete(p.id)} style={{ color: 'var(--danger-400)' }}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
            <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editing ? 'Editar Medicamento' : 'Registrar Medicamento'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre del Medicamento *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Paracetamol 500mg" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nombre Genérico</label>
                    <input className="form-input" value={form.generic_name} onChange={e => setForm({...form, generic_name: e.target.value})} placeholder="Ej: Acetaminofén" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Registro Sanitario</label>
                    <input className="form-input" value={form.sanitary_registration} onChange={e => setForm({...form, sanitary_registration: e.target.value})} placeholder="Ej: RS-2024-001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Precio Venta *</label>
                    <input className="form-input" type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Costo *</label>
                    <input className="form-input" type="number" step="0.01" required value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Actual *</label>
                    <input className="form-input" type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stock Mínimo</label>
                    <input className="form-input" type="number" value={form.min_stock} onChange={e => setForm({...form, min_stock: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de Vencimiento</label>
                    <input className="form-input" type="date" value={form.expiration_date} onChange={e => setForm({...form, expiration_date: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">N° Lote</label>
                    <input className="form-input" value={form.batch_number} onChange={e => setForm({...form, batch_number: e.target.value})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Presentación</label>
                    <input className="form-input" value={form.presentation} onChange={e => setForm({...form, presentation: e.target.value})} placeholder="Ej: Caja x 20 tabletas" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Laboratorio</label>
                    <input className="form-input" value={form.laboratory} onChange={e => setForm({...form, laboratory: e.target.value})} placeholder="Ej: Bayer" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Actualizar' : 'Registrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
