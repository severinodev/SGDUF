import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiEye, FiSearch } from 'react-icons/fi';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => { load(); }, [page, startDate, endDate]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const res = await api.get('/sales', { params });
      setSales(res.data.sales);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const viewSale = async (id) => {
    try { const res = await api.get(`/sales/${id}`); setSelectedSale(res.data); }
    catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge badge-success">Completada</span>;
      case 'returned': return <span className="badge badge-danger">Devuelta</span>;
      case 'partial_return': return <span className="badge badge-warning">Dev. Parcial</span>;
      default: return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <>
      <Header title="Historial de Ventas" subtitle="Todas las transacciones" />
      <div className="page-header"><div><h1>Historial de Ventas</h1><p>Registro de todas las ventas realizadas</p></div></div>

      <div className="filters-bar">
        <input className="form-input" type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} style={{ width: 180 }} />
        <input className="form-input" type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} style={{ width: 180 }} />
        <button className="btn btn-ghost" onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }}>Limpiar</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Comprobante</th><th>Fecha</th><th>Vendedor</th><th>Cliente</th><th>Total</th><th>Método</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="loading-spinner"><div className="spinner" /></div></td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No hay ventas</td></tr>
            ) : sales.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{s.receipt?.receipt_number || `#${s.id}`}</td>
                <td>{new Date(s.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{s.seller?.name || '—'}</td>
                <td>{s.client?.name || 'Consumidor Final'}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-400)' }}>${parseFloat(s.total).toFixed(2)}</td>
                <td><span className="badge badge-info">{s.payments?.[0]?.method || '—'}</span></td>
                <td>{statusBadge(s.status)}</td>
                <td><button className="btn btn-sm btn-ghost" onClick={() => viewSale(s.id)}><FiEye /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + Math.max(1, page - 2)).filter(p => p <= totalPages).map(p => (
            <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {selectedSale && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedSale(null)}>
          <div className="modal modal-lg">
            <div className="modal-header"><h2>Detalle de Venta #{selectedSale.id}</h2><button className="modal-close" onClick={() => setSelectedSale(null)}>✕</button></div>
            <div className="modal-body">
              <div className="form-row" style={{ marginBottom: 16 }}>
                <div><strong>Vendedor:</strong> {selectedSale.seller?.name}</div>
                <div><strong>Cliente:</strong> {selectedSale.client?.name || 'Consumidor Final'}</div>
                <div><strong>Comprobante:</strong> {selectedSale.receipt?.receipt_number}</div>
              </div>
              <table className="data-table" style={{ marginBottom: 16 }}>
                <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Desc.</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {selectedSale.details?.map(d => (
                    <tr key={d.id}>
                      <td>{d.product?.name}</td>
                      <td>{d.quantity}</td>
                      <td>${parseFloat(d.unit_price).toFixed(2)}</td>
                      <td>${parseFloat(d.discount).toFixed(2)}</td>
                      <td style={{ fontWeight: 600 }}>${parseFloat(d.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right' }}>
                <div>Subtotal: ${parseFloat(selectedSale.subtotal).toFixed(2)}</div>
                <div>IVA: ${parseFloat(selectedSale.tax).toFixed(2)}</div>
                {parseFloat(selectedSale.discount) > 0 && <div>Descuento: -${parseFloat(selectedSale.discount).toFixed(2)}</div>}
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-400)', marginTop: 8 }}>Total: ${parseFloat(selectedSale.total).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
