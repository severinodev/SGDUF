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
    if (searchParams.get('success')) setMsg('Pago completado con éxito. ¡Bienvenido al plan PRO!');
    if (searchParams.get('canceled')) setMsg('El pago fue cancelado.');
  }, [searchParams]);

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
      
      {msg && <div style={{ padding: 16, background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: 8, marginBottom: 24 }}>{msg}</div>}

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
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
              <div style={{ padding: '10px 16px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-primary)' }}>sgduf.com/{tenant.slug}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: 24, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiCreditCard /> Suscripción Actual
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, textTransform: 'capitalize' }}>Plan {tenant.plan}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {tenant.plan === 'free' ? 'Límites básicos' : 'Acceso completo ilimitado'}
              </div>
            </div>
            {tenant.plan !== 'free' && (
              <span style={{ padding: '6px 12px', background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Activo</span>
            )}
          </div>

          {tenant.plan === 'free' && (
            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Mejora tu plan</h3>
              <div style={{ border: '2px solid var(--primary-500)', borderRadius: 8, padding: 16, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, right: 16, background: 'var(--primary-500)', color: 'white', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>RECOMENDADO</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Plan Professional</div>
                <div style={{ fontSize: 24, fontWeight: 700, margin: '8px 0' }}>$49.99<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/mes</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-500)" /> Usuarios ilimitados</li>
                  <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-500)" /> Productos ilimitados</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiCheck color="var(--primary-500)" /> Soporte prioritario</li>
                </ul>
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => handleSubscribe('professional')}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Actualizar a PRO'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
