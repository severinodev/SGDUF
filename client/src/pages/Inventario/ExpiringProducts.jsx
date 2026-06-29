import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiClock } from 'react-icons/fi';

export default function ExpiringProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(90);

  useEffect(() => { load(); }, [days]);

  const load = async () => {
    setLoading(true);
    try { const res = await api.get('/products/expiring', { params: { days } }); setProducts(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getDaysUntil = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  const getExpiryBadge = (date) => {
    const d = getDaysUntil(date);
    if (d < 0) return <span className="badge badge-danger">Vencido</span>;
    if (d <= 15) return <span className="badge badge-danger">{d} días</span>;
    if (d <= 30) return <span className="badge badge-warning">{d} días</span>;
    return <span className="badge badge-info">{d} días</span>;
  };

  return (
    <>
      <Header title="Control de Vencimientos" subtitle="Productos próximos a vencer" />
      <div className="page-header">
        <div><h1>Control de Vencimientos</h1><p>Productos próximos a vencer o vencidos</p></div>
        <select className="form-select" value={days} onChange={(e) => setDays(e.target.value)} style={{ width: 180 }}>
          <option value="15">Próximos 15 días</option>
          <option value="30">Próximos 30 días</option>
          <option value="60">Próximos 60 días</option>
          <option value="90">Próximos 90 días</option>
          <option value="180">Próximos 180 días</option>
        </select>
      </div>
      {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
        products.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">✅</div><h3>Sin productos por vencer</h3><p>No hay productos por vencer en el período seleccionado</p></div>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-chip"><FiClock style={{ color: 'var(--warning-400)' }} /> <span className="stat-value">{products.length}</span> productos por vencer</div>
              <div className="stat-chip">Valor en riesgo: <span className="stat-value" style={{ color: 'var(--danger-400)' }}>${products.reduce((s, p) => s + (parseFloat(p.cost) * p.stock), 0).toFixed(2)}</span></div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Producto</th><th>Lote</th><th>Stock</th><th>Vencimiento</th><th>Tiempo Restante</th><th>Valor en Riesgo</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.category?.name}</div></td>
                      <td>{p.batch_number || '—'}</td>
                      <td>{p.stock}</td>
                      <td>{new Date(p.expiration_date).toLocaleDateString('es-ES')}</td>
                      <td>{getExpiryBadge(p.expiration_date)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--danger-400)' }}>${(parseFloat(p.cost) * p.stock).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </>
  );
}
