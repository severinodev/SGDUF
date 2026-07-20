import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiDollarSign, FiUnlock, FiLock } from 'react-icons/fi';

export default function CashRegister() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [openingAmount, setOpeningAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const currRes = await api.get('/cash-register/current').catch(() => ({ data: null }));
      const histRes = await api.get('/cash-register/history').catch(() => ({ data: [] }));
      setCurrent(currRes.data);
      setHistory(histRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpen = async () => {
    try {
      await api.post('/cash-register/open', { opening_amount: parseFloat(openingAmount) || 0 });
      setMessage({ type: 'success', text: 'Caja abierta exitosamente' });
      setOpeningAmount('');
      load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error' }); }
  };

  const handleClose = async () => {
    if (!confirm('¿Cerrar la caja?')) return;
    try {
      await api.put('/cash-register/close');
      setMessage({ type: 'success', text: 'Caja cerrada exitosamente' });
      load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error' }); }
  };

  if (loading) return <><Header title="Caja" /><div className="loading-spinner"><div className="spinner" /></div></>;

  return (
    <>
      <Header title="Caja" subtitle="Apertura y cierre de caja" />
      <div className="page-header"><div><h1>Control de Caja</h1><p>Apertura y cierre diario de caja</p></div></div>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      {!current ? (
        <div className="card" style={{ maxWidth: 500 }}>
          <div className="card-header"><h3><FiUnlock /> Abrir Caja</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Monto de Apertura ($)</label>
              <input className="form-input" type="number" step="0.01" value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} placeholder="0.00" />
            </div>
            <button className="btn btn-primary" onClick={handleOpen}><FiUnlock /> Abrir Caja</button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: 500 }}>
          <div className="card-header"><h3><FiDollarSign /> Caja Abierta</h3><span className="badge badge-success">Activa</span></div>
          <div className="card-body">
            <div className="pos-total-row"><span>Monto de Apertura</span><span>${parseFloat(current.opening_amount).toFixed(2)}</span></div>
            <div className="pos-total-row"><span>Abierta desde</span><span>{new Date(current.opened_at).toLocaleString('es-ES')}</span></div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-danger" onClick={handleClose}><FiLock /> Cerrar Caja</button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 30, marginBottom: 16 }}>Historial de Cajas</h2>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Usuario</th><th>Apertura</th><th>Cierre</th><th>Monto Inicial</th><th>Ventas</th><th>Efectivo</th><th>Tarjeta</th><th>Estado</th></tr></thead>
          <tbody>
            {history.map(r => (
              <tr key={r.id}>
                <td>{r.user?.name}</td>
                <td>{new Date(r.opened_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{r.closed_at ? new Date(r.closed_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                <td>${parseFloat(r.opening_amount).toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${parseFloat(r.total_sales || 0).toFixed(2)}</td>
                <td>${parseFloat(r.total_cash || 0).toFixed(2)}</td>
                <td>${parseFloat(r.total_card || 0).toFixed(2)}</td>
                <td>{r.status === 'open' ? <span className="badge badge-success">Abierta</span> : <span className="badge badge-info">Cerrada</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
