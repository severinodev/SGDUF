import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBox, FiUser, FiMail, FiLock } from 'react-icons/fi';

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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar organización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><FiBox /></div>
          <h2>Crea tu Farmacia</h2>
          <p>Únete a SGDUF y gestiona tu negocio</p>
        </div>

        {error && <div style={{ color: 'var(--danger-500)', background: 'var(--danger-50)', padding: 12, borderRadius: 8, marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 ? (
            <div className="auth-step">
              <div className="form-group">
                <label>Nombre de la Farmacia</label>
                <div className="input-group">
                  <FiBox className="input-icon" />
                  <input 
                    type="text" 
                    required
                    value={formData.tenant_name}
                    onChange={handleOrgChange}
                    placeholder="Ej. Farmacia Cruz Azul"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>URL de acceso</label>
                <div className="input-group">
                  <span style={{ padding: '0 12px', color: 'var(--text-muted)', borderRight: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center' }}>sgduf.com/</span>
                  <input 
                    type="text" 
                    required
                    value={formData.tenant_slug}
                    onChange={(e) => setFormData({...formData, tenant_slug: e.target.value})}
                  />
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-block" onClick={() => {
                if (formData.tenant_name && formData.tenant_slug) setStep(2);
              }}>
                Continuar
              </button>
            </div>
          ) : (
            <div className="auth-step">
              <div className="form-group">
                <label>Tu Nombre (Administrador)</label>
                <div className="input-group">
                  <FiUser className="input-icon" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-primary)' }} onClick={() => setStep(1)}>
                  Volver
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Cuenta'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="auth-footer" style={{ marginTop: 20, textAlign: 'center' }}>
          <p>¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--primary-500)' }}>Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
