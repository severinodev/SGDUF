import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { TbPill } from 'react-icons/tb';

export default function RegisterTenant() {
  const navigate = useNavigate();
  const { registerTenant, login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_slug: '',
    name: '',
    email: '',
    password: ''
  });

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleOrgChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      tenant_name: name,
      tenant_slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await registerTenant(formData);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar organización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 460 }}>
        <div className="login-logo"><TbPill /></div>
        <h1>Crea tu Farmacia</h1>
        <p className="login-subtitle">Únete a Farmasys y gestiona tu negocio</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="form-group">
                <label className="form-label">Nombre de la Farmacia</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  value={formData.tenant_name}
                  onChange={handleOrgChange}
                  placeholder="Ej. Farmacia Cruz Azul"
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL de acceso</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <span style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: 14, borderRight: '1px solid var(--border-primary)', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.02)' }}>sgduf.vercel.app/</span>
                  <input 
                    type="text" 
                    style={{ border: 'none', background: 'transparent', padding: '12px 14px', width: '100%', color: 'var(--text-primary)', outline: 'none', fontSize: 14 }}
                    required
                    value={formData.tenant_slug}
                    onChange={(e) => setFormData({...formData, tenant_slug: e.target.value})}
                    placeholder="mi-farmacia"
                  />
                </div>
              </div>
              <button type="button" className="btn btn-primary login-btn" onClick={() => {
                if (formData.tenant_name && formData.tenant_slug) setStep(2);
              }}>
                Continuar <FiArrowRight style={{ marginLeft: 8 }} />
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Tu Nombre (Administrador)</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Tu nombre completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  className="form-input"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-primary)', padding: 12 }} onClick={() => setStep(1)}>
                  <FiArrowLeft style={{ marginRight: 6 }} /> Volver
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 12 }} disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Cuenta'}
                </button>
              </div>
            </>
          )}
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
          ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
