import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiDollarSign, FiShoppingCart, FiPackage, FiAlertTriangle, FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <>
      <Header title="Dashboard" subtitle="Panel gerencial" />
      <div className="loading-spinner"><div className="spinner" /></div>
    </>
  );

  const salesChartData = data?.salesLast7Days?.map(d => ({
    date: new Date(d.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
    ventas: parseFloat(d.total) || 0,
    cantidad: parseInt(d.count) || 0
  })) || [];

  const topProductsData = data?.topProducts?.map(p => ({
    name: p.product?.name?.substring(0, 15) || 'N/A',
    vendidos: parseInt(p.total_sold) || 0,
    ingresos: parseFloat(p.total_revenue) || 0
  })) || [];

  return (
    <>
      <Header title="Dashboard" subtitle="Panel gerencial" />

      <div className="page-header">
        <div>
          <h1>Dashboard Gerencial</h1>
          <p>Resumen general del sistema</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card teal">
          <div className="kpi-icon teal"><FiDollarSign /></div>
          <div className="kpi-value">${(data?.todaySalesTotal || 0).toFixed(2)}</div>
          <div className="kpi-label">Ventas del día ({data?.todaySalesCount || 0} transacciones)</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon green"><FiTrendingUp /></div>
          <div className="kpi-value">${(data?.monthSalesTotal || 0).toFixed(2)}</div>
          <div className="kpi-label">Ventas del mes</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon purple"><FiPackage /></div>
          <div className="kpi-value">{data?.totalProducts || 0}</div>
          <div className="kpi-label">Productos activos</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-icon yellow"><FiAlertTriangle /></div>
          <div className="kpi-value">{data?.lowStockCount || 0}</div>
          <div className="kpi-label">Stock bajo</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-icon red"><FiClock /></div>
          <div className="kpi-value">{data?.expiringCount || 0}</div>
          <div className="kpi-label">Por vencer (30 días)</div>
        </div>
        <div className="kpi-card teal">
          <div className="kpi-icon teal"><FiUsers /></div>
          <div className="kpi-value">{data?.totalClients || 0}</div>
          <div className="kpi-label">Total clientes</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Ventas - Últimos 7 Días</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: '#1a2035',
                      border: '1px solid rgba(56,189,248,0.2)',
                      borderRadius: 8,
                      color: '#f1f5f9',
                      fontSize: 12
                    }}
                  />
                  <Area type="monotone" dataKey="ventas" stroke="#06b6d4" fill="url(#colorVentas)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Productos Más Vendidos</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={120} />
                  <Tooltip
                    contentStyle={{
                      background: '#1a2035',
                      border: '1px solid rgba(56,189,248,0.2)',
                      borderRadius: 8,
                      color: '#f1f5f9',
                      fontSize: 12
                    }}
                  />
                  <Bar dataKey="vendidos" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
