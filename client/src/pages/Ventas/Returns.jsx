import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiRotateCcw } from 'react-icons/fi';

export default function Returns() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get('/sales', { params: { limit: 50 } });
      setSales(res.data.sales.filter(s => s.status === 'completed'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReturn = async (saleId) => {
    if (!confirm('¿Está seguro de procesar la devolución? Se restaurará el stock de los productos.')) return;
    try {
      await api.post(`/sales/${saleId}/return`);
      setMessage({ type: 'success', text: 'Devolución procesada exitosamente' });
      load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.message || 'Error al procesar devolución' }); }
  };

  return (
    <>
      <Header title="Devoluciones" subtitle="Gestión de devoluciones" />
      <div className="page-header"><div><h1>Devoluciones de Ventas</h1><p>Procesar devoluciones y restaurar stock</p></div></div>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Comprobante</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Vendedor</th><th></th></tr></thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No hay ventas para devolver</td></tr>
              ) : sales.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{s.receipt?.receipt_number || `#${s.id}`}</td>
                  <td>{new Date(s.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{s.client?.name || 'Consumidor Final'}</td>
                  <td style={{ fontWeight: 700 }}>${parseFloat(s.total).toFixed(2)}</td>
                  <td>{s.seller?.name || '—'}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => handleReturn(s.id)}><FiRotateCcw /> Devolver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
