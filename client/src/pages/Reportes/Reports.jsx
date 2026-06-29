import { useState } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiBarChart2, FiDownload, FiPackage, FiShoppingCart, FiClock, FiTrendingUp, FiTruck } from 'react-icons/fi';

const reportTypes = [
  { id: 'sales', label: 'Reporte de Ventas', icon: FiShoppingCart, color: 'teal', desc: 'Ventas por período con totales y promedios' },
  { id: 'inventory', label: 'Reporte de Inventario', icon: FiPackage, color: 'green', desc: 'Estado actual de todo el inventario' },
  { id: 'expiring', label: 'Productos por Vencer', icon: FiClock, color: 'yellow', desc: 'Productos próximos a su fecha de vencimiento' },
  { id: 'top-products', label: 'Más Vendidos', icon: FiTrendingUp, color: 'purple', desc: 'Ranking de productos con mayor demanda' },
  { id: 'purchases', label: 'Reporte de Compras', icon: FiTruck, color: 'teal', desc: 'Compras a proveedores por período' },
];

export default function Reports() {
  const [activeReport, setActiveReport] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadReport = async (type) => {
    setActiveReport(type);
    setLoading(true);
    setData(null);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const res = await api.get(`/reports/${type}`, { params });
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const renderReport = () => {
    if (!data) return null;

    switch (activeReport) {
      case 'sales':
        return (
          <>
            <div className="kpi-grid" style={{ marginBottom: 20 }}>
              <div className="kpi-card teal"><div className="kpi-icon teal"><FiShoppingCart /></div><div className="kpi-value">{data.summary?.totalSales}</div><div className="kpi-label">Total Ventas</div></div>
              <div className="kpi-card green"><div className="kpi-icon green"><FiTrendingUp /></div><div className="kpi-value">${data.summary?.totalRevenue?.toFixed(2)}</div><div className="kpi-label">Ingresos Totales</div></div>
              <div className="kpi-card purple"><div className="kpi-icon purple"><FiBarChart2 /></div><div className="kpi-value">${data.summary?.averageTicket?.toFixed(2)}</div><div className="kpi-label">Ticket Promedio</div></div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Fecha</th><th>Vendedor</th><th>Cliente</th><th>Subtotal</th><th>IVA</th><th>Desc.</th><th>Total</th></tr></thead>
                <tbody>{data.sales?.map(s => (
                  <tr key={s.id}>
                    <td>{new Date(s.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>{s.seller?.name}</td>
                    <td>{s.client?.name || 'C.F.'}</td>
                    <td>${parseFloat(s.subtotal).toFixed(2)}</td>
                    <td>${parseFloat(s.tax).toFixed(2)}</td>
                    <td>${parseFloat(s.discount).toFixed(2)}</td>
                    <td style={{ fontWeight: 700 }}>${parseFloat(s.total).toFixed(2)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        );

      case 'inventory':
        return (
          <>
            <div className="kpi-grid" style={{ marginBottom: 20 }}>
              <div className="kpi-card teal"><div className="kpi-icon teal"><FiPackage /></div><div className="kpi-value">{data.summary?.totalProducts}</div><div className="kpi-label">Total Productos</div></div>
              <div className="kpi-card green"><div className="kpi-icon green"><FiTrendingUp /></div><div className="kpi-value">${data.summary?.totalSaleValue?.toFixed(2)}</div><div className="kpi-label">Valor en Venta</div></div>
              <div className="kpi-card yellow"><div className="kpi-icon yellow"><FiBarChart2 /></div><div className="kpi-value">${data.summary?.potentialProfit?.toFixed(2)}</div><div className="kpi-label">Ganancia Potencial</div></div>
              <div className="kpi-card red"><div className="kpi-icon red"><FiBarChart2 /></div><div className="kpi-value">{data.summary?.lowStockCount}</div><div className="kpi-label">Stock Bajo</div></div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Costo Unit.</th><th>Precio</th><th>Valor Stock</th></tr></thead>
                <tbody>{data.products?.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td>{p.category?.name || '—'}</td>
                    <td style={{ color: p.stock <= p.min_stock ? 'var(--danger-400)' : 'inherit' }}>{p.stock}</td>
                    <td>${parseFloat(p.cost).toFixed(2)}</td>
                    <td>${parseFloat(p.price).toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>${(parseFloat(p.price) * p.stock).toFixed(2)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        );

      case 'expiring':
        return (
          <>
            <div className="kpi-grid" style={{ marginBottom: 20 }}>
              <div className="kpi-card yellow"><div className="kpi-icon yellow"><FiClock /></div><div className="kpi-value">{data.summary?.totalExpiring}</div><div className="kpi-label">Por Vencer</div></div>
              <div className="kpi-card red"><div className="kpi-icon red"><FiBarChart2 /></div><div className="kpi-value">{data.summary?.expiredCount}</div><div className="kpi-label">Vencidos</div></div>
              <div className="kpi-card teal"><div className="kpi-icon teal"><FiTrendingUp /></div><div className="kpi-value">${data.summary?.totalValueAtRisk?.toFixed(2)}</div><div className="kpi-label">Valor en Riesgo</div></div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Producto</th><th>Lote</th><th>Stock</th><th>Vencimiento</th><th>Valor</th></tr></thead>
                <tbody>{data.products?.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td>{p.batch_number || '—'}</td>
                    <td>{p.stock}</td>
                    <td style={{ color: new Date(p.expiration_date) < new Date() ? 'var(--danger-400)' : 'var(--warning-400)' }}>{new Date(p.expiration_date).toLocaleDateString('es-ES')}</td>
                    <td>${(parseFloat(p.cost) * p.stock).toFixed(2)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        );

      case 'top-products':
        return (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>#</th><th>Producto</th><th>Unidades Vendidas</th><th>Ingresos</th></tr></thead>
              <tbody>{data.topProducts?.map((p, i) => (
                <tr key={i}>
                  <td><span className="badge badge-purple" style={{ minWidth: 28, justifyContent: 'center' }}>{i + 1}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.product?.name || 'N/A'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-400)' }}>{p.total_sold}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-400)' }}>${parseFloat(p.total_revenue).toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        );

      case 'purchases':
        return (
          <>
            <div className="kpi-grid" style={{ marginBottom: 20 }}>
              <div className="kpi-card teal"><div className="kpi-icon teal"><FiTruck /></div><div className="kpi-value">{data.summary?.totalPurchases}</div><div className="kpi-label">Total Compras</div></div>
              <div className="kpi-card green"><div className="kpi-icon green"><FiTrendingUp /></div><div className="kpi-value">${data.summary?.totalSpent?.toFixed(2)}</div><div className="kpi-label">Total Invertido</div></div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Fecha</th><th>Proveedor</th><th>Factura</th><th>Registrado por</th><th>Total</th></tr></thead>
                <tbody>{data.purchases?.map(p => (
                  <tr key={p.id}>
                    <td>{new Date(p.purchase_date).toLocaleDateString('es-ES')}</td>
                    <td style={{ fontWeight: 600 }}>{p.supplier?.name}</td>
                    <td>{p.invoice_number || '—'}</td>
                    <td>{p.registeredBy?.name}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-400)' }}>${parseFloat(p.total).toFixed(2)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        );

      default: return null;
    }
  };

  return (
    <>
      <Header title="Reportes" subtitle="Centro de reportes gerenciales" />
      <div className="page-header"><div><h1>Centro de Reportes</h1><p>Genera y exporta reportes del sistema</p></div></div>

      {!activeReport ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {reportTypes.map(r => (
            <div key={r.id} className={`kpi-card ${r.color}`} style={{ cursor: 'pointer' }} onClick={() => loadReport(r.id)}>
              <div className={`kpi-icon ${r.color}`}><r.icon /></div>
              <div className="kpi-value" style={{ fontSize: 18, marginBottom: 6 }}>{r.label}</div>
              <div className="kpi-label">{r.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="filters-bar">
            <button className="btn btn-ghost" onClick={() => { setActiveReport(null); setData(null); }}>← Volver</button>
            <h3 style={{ fontWeight: 600 }}>{reportTypes.find(r => r.id === activeReport)?.label}</h3>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <input className="form-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: 160 }} />
              <input className="form-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: 160 }} />
              <button className="btn btn-primary" onClick={() => loadReport(activeReport)}>Generar</button>
            </div>
          </div>

          {loading ? <div className="loading-spinner"><div className="spinner" /></div> : renderReport()}
        </>
      )}
    </>
  );
}
