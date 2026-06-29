import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiAlertTriangle } from 'react-icons/fi';

export default function StockAlerts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await api.get('/products/low-stock'); setProducts(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <>
      <Header title="Alertas de Stock" subtitle="Productos con stock bajo" />
      <div className="page-header"><div><h1>Alertas de Stock Mínimo</h1><p>Productos que necesitan reposición</p></div></div>
      {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
        products.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">✅</div><h3>Sin alertas</h3><p>Todos los productos tienen stock suficiente</p></div>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-chip"><FiAlertTriangle style={{ color: 'var(--danger-400)' }} /> <span className="stat-value">{products.length}</span> productos con stock bajo</div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Producto</th><th>Categoría</th><th>Stock Actual</th><th>Stock Mínimo</th><th>Déficit</th><th>Estado</th></tr></thead>
                <tbody>
                  {products.map(p => {
                    const deficit = p.min_stock - p.stock;
                    return (
                      <tr key={p.id}>
                        <td><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.laboratory}</div></td>
                        <td>{p.category?.name || '—'}</td>
                        <td style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--danger-400)' : 'var(--warning-400)' }}>{p.stock}</td>
                        <td>{p.min_stock}</td>
                        <td style={{ fontWeight: 600, color: 'var(--danger-400)' }}>{deficit > 0 ? `-${deficit}` : '0'}</td>
                        <td>{p.stock === 0 ? <span className="badge badge-danger">Agotado</span> : <span className="badge badge-warning">Stock Bajo</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </>
  );
}
