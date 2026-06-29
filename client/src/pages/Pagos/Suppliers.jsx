import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiTruck, FiSearch } from 'react-icons/fi';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', ruc: '', phone: '', email: '', address: '' });
  const [message, setMessage] = useState(null);

  // Supplier payments
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payForm, setPayForm] = useState({ supplier_id: '', amount: '', method: 'cash', reference: '' });

  useEffect(() => { load(); loadPayments(); }, [search]);

  const load = async () => {
    try { const res = await api.get('/suppliers', { params: { search: search || undefined } }); setSuppliers(res.data); }
    catch (err) { console.error(err); }
  };

  const loadPayments = async () => {
    try { const res = await api.get('/payments/supplier'); setPayments(res.data); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/suppliers/${editing.id}`, form); }
      else { await api.post('/suppliers', form); }
      setShowModal(false); setEditing(null); load();
      setMessage({ type: 'success', text: editing ? 'Proveedor actualizado' : 'Proveedor creado' });
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error' }); }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments/supplier', payForm);
      setShowPaymentModal(false);
      setPayForm({ supplier_id: '', amount: '', method: 'cash', reference: '' });
      loadPayments();
      setMessage({ type: 'success', text: 'Pago registrado exitosamente' });
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error' }); }
  };

  return (
    <>
      <Header title="Proveedores" subtitle="Gestión de proveedores y pagos" />
      <div className="page-header">
        <div><h1>Proveedores</h1><p>Gestión de proveedores y pagos</p></div>
        <div className="toolbar">
          <button className="btn btn-success" onClick={() => { setPayForm({ supplier_id: '', amount: '', method: 'cash', reference: '' }); setShowPaymentModal(true); }}>
            <FiTruck /> Registrar Pago
          </button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', ruc: '', phone: '', email: '', address: '' }); setShowModal(true); }}>
            <FiPlus /> Nuevo Proveedor
          </button>
        </div>
      </div>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Buscar proveedor..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>

      <div className="table-container" style={{ marginBottom: 30 }}>
        <table className="data-table">
          <thead><tr><th>Nombre</th><th>RUC</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr></thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                <td>{s.ruc || '—'}</td>
                <td>{s.phone || '—'}</td>
                <td>{s.email || '—'}</td>
                <td>
                  <div className="toolbar">
                    <button className="btn btn-sm btn-ghost" onClick={() => { setEditing(s); setForm({ name: s.name, ruc: s.ruc || '', phone: s.phone || '', email: s.email || '', address: s.address || '' }); setShowModal(true); }}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-400)' }} onClick={async () => { if(confirm('¿Eliminar?')){ await api.delete(`/suppliers/${s.id}`); load(); } }}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Pagos a Proveedores</h2>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Proveedor</th><th>Monto</th><th>Método</th><th>Referencia</th><th>Fecha</th></tr></thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Sin pagos registrados</td></tr>
            ) : payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.supplier?.name}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-400)' }}>${parseFloat(p.amount).toFixed(2)}</td>
                <td><span className="badge badge-info">{p.method}</span></td>
                <td>{p.reference || '—'}</td>
                <td>{new Date(p.payment_date).toLocaleDateString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supplier Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>{editing ? 'Editar' : 'Nuevo'} Proveedor</h2><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row"><div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div><div className="form-group"><label className="form-label">RUC</label><input className="form-input" value={form.ruc} onChange={e => setForm({...form, ruc: e.target.value})} /></div></div>
                <div className="form-row"><div className="form-group"><label className="form-label">Teléfono</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div></div>
                <div className="form-group"><label className="form-label">Dirección</label><input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Guardar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowPaymentModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>Registrar Pago a Proveedor</h2><button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button></div>
            <form onSubmit={handlePayment}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Proveedor *</label><select className="form-select" required value={payForm.supplier_id} onChange={e => setPayForm({...payForm, supplier_id: e.target.value})}><option value="">Seleccionar...</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div className="form-row"><div className="form-group"><label className="form-label">Monto *</label><input className="form-input" type="number" step="0.01" required value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} /></div><div className="form-group"><label className="form-label">Método</label><select className="form-select" value={payForm.method} onChange={e => setPayForm({...payForm, method: e.target.value})}><option value="cash">Efectivo</option><option value="transfer">Transferencia</option><option value="check">Cheque</option></select></div></div>
                <div className="form-group"><label className="form-label">Referencia</label><input className="form-input" value={payForm.reference} onChange={e => setPayForm({...payForm, reference: e.target.value})} placeholder="N° cheque, transacción, etc." /></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowPaymentModal(false)}>Cancelar</button><button type="submit" className="btn btn-success">Registrar Pago</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
