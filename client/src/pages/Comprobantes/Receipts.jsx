import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiFileText, FiDownload, FiSearch } from 'react-icons/fi';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [page, search, type]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/receipts', { params: { page, limit: 15, search: search || undefined, type: type || undefined } });
      setReceipts(res.data.receipts);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const downloadPDF = async (id, number) => {
    try {
      const res = await api.get(`/receipts/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_${number}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <Header title="Comprobantes" subtitle="Consulta y exportación" />
      <div className="page-header"><div><h1>Comprobantes</h1><p>Consultar y exportar comprobantes</p></div></div>

      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Buscar por N° comprobante..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft: 36 }} />
        </div>
        <select className="form-select" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="">Todos los tipos</option>
          <option value="factura">Factura</option>
          <option value="nota_venta">Nota de Venta</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>N° Comprobante</th><th>Tipo</th><th>Fecha</th><th>Cliente</th><th>Vendedor</th><th>Subtotal</th><th>IVA</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><div className="loading-spinner"><div className="spinner" /></div></td></tr>
            ) : receipts.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No hay comprobantes</td></tr>
            ) : receipts.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{r.receipt_number}</td>
                <td><span className={`badge ${r.type === 'factura' ? 'badge-purple' : 'badge-info'}`}>{r.type === 'factura' ? 'Factura' : 'Nota de Venta'}</span></td>
                <td>{new Date(r.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{r.sale?.client?.name || 'Consumidor Final'}</td>
                <td>{r.sale?.seller?.name || '—'}</td>
                <td>${parseFloat(r.subtotal).toFixed(2)}</td>
                <td>${parseFloat(r.tax_amount).toFixed(2)}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-400)' }}>${parseFloat(r.total).toFixed(2)}</td>
                <td><button className="btn btn-sm btn-ghost" onClick={() => downloadPDF(r.id, r.receipt_number)}><FiDownload /> PDF</button></td>
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
    </>
  );
}
