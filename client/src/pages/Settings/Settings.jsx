import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { FiCheck, FiSettings, FiCreditCard } from 'react-icons/fi';

export default function Settings() {
  const { tenant, setTenant } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (searchParams.get('success')) {
      setMsg('Pago completado con éxito. ¡Bienvenido a tu nuevo plan!');
      // Refetch tenant settings to update the local state immediately
      const refreshTenant = async () => {
        try {
          const res = await api.get('/tenants/me');
          if (res.data) setTenant(res.data);
        } catch (err) {
          console.error('Error refreshing tenant settings:', err);
        }
      };
      refreshTenant();
    }
    if (searchParams.get('canceled')) setMsg('El pago fue cancelado.');
  }, [searchParams, setTenant]);

  const handleSubscribe = async (plan) => {
    try {
      setLoading(true);
      const res = await api.post('/payments/create-checkout', { plan });
      window.location.href = res.data.url;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al iniciar pago';
      alert(errMsg);
      setLoading(false);
    }
  };

  if (!tenant) return <div style={{ padding: 20 }}>Cargando...</div>;

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Configuración de Farmacia</h1>
      
      {msg && <div style={{ padding: 16, background: 'rgba(16,185,129,0.1)', color: 'var(--success-400)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, marginBottom: 24 }}>{msg}</div>}

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', marginBottom: 32 }}>
        <div style={{ background: 'var(--bg-secondary)', padding: 24, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiSettings /> Datos Generales
          </h2>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>Nombre</label>
              <div style={{ padding: '10px 16px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-primary)' }}>{tenant.name}</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>URL</label>
              <div style={{ padding: '10px 16px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-primary)' }}>sgduf.vercel.app/{tenant.slug}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: 24, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiCreditCard /> Suscripción Actual
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', paddingBottom: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, textTransform: 'capitalize' }}>Plan {tenant.plan}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                {tenant.plan === 'free' && 'Límites básicos (Gratuito)'}
                {tenant.plan === 'professional' && 'Acceso Profesional (15 usuarios)'}
                {tenant.plan === 'enterprise' && 'Acceso Ilimitado Total'}
              </div>
            </div>
            {tenant.plan !== 'free' && (
              <span style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success-400)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Activo</span>
            )}
          </div>
        </div>
      </div>

      {tenant.plan !== 'enterprise' && (
        <div style={{ background: 'var(--bg-secondary)', padding: 32, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>Mejora tu plan</h3>
          
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
            {/* Plan Professional */}
            <div style={{ 
              border: tenant.plan === 'free' ? '2px solid var(--primary-500)' : '1px solid var(--border-primary)', 
              borderRadius: 12, 
              padding: 24, 
              position: 'relative',
              background: 'var(--bg-primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {tenant.plan === 'free' && (
                <div style={{ position: 'absolute', top: -12, right: 16, background: 'var(--primary-500)', color: 'white', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>RECOMENDADO</div>
              )}
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Plan Professional</div>
                <div style={{ fontSize: 24, fontWeight: 700, margin: '12px 0' }}>$49.99<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/mes</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> 15 usuarios</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Productos ilimitados</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> POS avanzado</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Reportes completos</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Soporte prioritario</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Multi-sucursal</li>
                </ul>
              </div>
              {tenant.plan === 'professional' ? (
                <button className="btn btn-block" disabled style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Tu Plan Actual</button>
              ) : (
                <button 
                  className="btn btn-primary btn-block" 
                  style={{ width: '100%' }}
                  onClick={() => handleSubscribe('professional')}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Adquirir Professional'}
                </button>
              )}
            </div>

            {/* Plan Enterprise */}
            <div style={{ 
              border: '1px solid var(--border-primary)', 
              borderRadius: 12, 
              padding: 24, 
              position: 'relative',
              background: 'var(--bg-primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Plan Enterprise</div>
                <div style={{ fontSize: 24, fontWeight: 700, margin: '12px 0' }}>$99.99<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/mes</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Usuarios ilimitados</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Todo lo del plan Professional</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> API personalizada</li>
                  <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Soporte dedicado</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-400)" /> Onboarding guiado</li>
                </ul>
              </div>
              <button 
                className="btn btn-primary btn-block" 
                style={{ width: '100%' }}
                onClick={() => handleSubscribe('enterprise')}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Adquirir Enterprise'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
