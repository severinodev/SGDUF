import { Link } from 'react-router-dom';
import { FiBox, FiShield, FiBarChart2, FiUsers, FiCheck, FiArrowRight, FiPackage, FiDollarSign } from 'react-icons/fi';

const features = [
  { icon: FiPackage, title: 'Inventario Inteligente', desc: 'Control de stock, alertas de vencimiento y productos por agotarse en tiempo real.' },
  { icon: FiDollarSign, title: 'Punto de Venta (POS)', desc: 'Interfaz rápida para ventas con búsqueda de productos, descuentos y múltiples métodos de pago.' },
  { icon: FiBarChart2, title: 'Reportes y Analytics', desc: 'Dashboards con ventas diarias, productos top y tendencias de tu negocio.' },
  { icon: FiUsers, title: 'Gestión de Usuarios', desc: 'Roles de admin, gerente y cajero con permisos granulares por función.' },
  { icon: FiShield, title: 'Seguridad', desc: 'Datos aislados por organización, cifrado JWT y auditoría de accesos.' },
  { icon: FiBox, title: 'Multi-Farmacia', desc: 'Gestiona múltiples sucursales desde una sola cuenta con datos independientes.' },
];

const plans = [
  { 
    name: 'Gratis', price: '$0', period: '/siempre', 
    features: ['2 usuarios', '50 productos', 'POS básico', 'Reportes limitados'], 
    cta: 'Empieza Gratis', highlight: false 
  },
  { 
    name: 'Professional', price: '$49.99', period: '/mes',
    features: ['15 usuarios', 'Productos ilimitados', 'POS avanzado', 'Reportes completos', 'Soporte prioritario', 'Multi-sucursal'],
    cta: 'Empieza Ahora', highlight: true
  },
  { 
    name: 'Enterprise', price: '$99.99', period: '/mes',
    features: ['Usuarios ilimitados', 'Todo del Professional', 'API personalizada', 'Soporte dedicado', 'Onboarding guiado'],
    cta: 'Contactar Ventas', highlight: false
  }
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-bg)', color: 'var(--text-primary)' }}>

      {/* ─── Navbar ─── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', maxWidth: 1200, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white'
          }}><FiBox /></div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Farmasys</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" className="btn" style={{ border: '1px solid var(--border-primary)', padding: '10px 24px' }}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Crear Cuenta <FiArrowRight style={{ marginLeft: 6 }} />
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{
        textAlign: 'center', padding: '80px 40px 60px', maxWidth: 800, margin: '0 auto', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)',
          pointerEvents: 'none'
        }} />
        <span style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 20,
          background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)',
          fontSize: 13, fontWeight: 600, color: 'var(--primary-400)', marginBottom: 24
        }}>
          🚀 Plataforma SaaS para Farmacias
        </span>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Gestiona tu farmacia{' '}
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            de forma inteligente
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Control de inventario, punto de venta, reportes y más. Todo en una plataforma segura, rápida y diseñada para farmacias y droguerías.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
            Crear Cuenta Gratis <FiArrowRight style={{ marginLeft: 8 }} />
          </Link>
          <Link to="/login" className="btn" style={{ padding: '14px 32px', fontSize: 16, border: '1px solid var(--border-primary)' }}>
            Ver Demo
          </Link>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{ padding: '60px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Todo lo que necesitas</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48, fontSize: 16 }}>
          Herramientas profesionales diseñadas específicamente para el sector farmacéutico
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: 28, borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-card)', border: '1px solid var(--border-primary)',
              transition: 'var(--transition-base)', cursor: 'default'
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, color: 'var(--primary-400)', fontSize: 22
              }}>
                <f.icon />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section style={{ padding: '60px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Precios Simples</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48, fontSize: 16 }}>
          Sin costos ocultos. Empieza gratis y crece a tu ritmo.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {plans.map((p, i) => (
            <div key={i} style={{
              padding: 32, borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-card)',
              border: p.highlight ? '2px solid var(--primary-500)' : '1px solid var(--border-primary)',
              position: 'relative',
              transform: p.highlight ? 'scale(1.03)' : 'none',
              boxShadow: p.highlight ? 'var(--shadow-glow)' : 'none'
            }}>
              {p.highlight && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gradient-primary)', padding: '5px 16px', borderRadius: 20,
                  fontSize: 12, fontWeight: 700, color: 'white', whiteSpace: 'nowrap'
                }}>
                  MÁS POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{p.name}</h3>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800 }}>{p.price}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <FiCheck style={{ color: 'var(--primary-400)', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`btn ${p.highlight ? 'btn-primary' : ''}`} style={{
                width: '100%', display: 'flex', justifyContent: 'center', padding: 12,
                border: p.highlight ? 'none' : '1px solid var(--border-primary)'
              }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Final ─── */}
      <section style={{
        padding: '60px 40px', maxWidth: 800, margin: '0 auto', textAlign: 'center'
      }}>
        <div style={{
          padding: '48px 40px', borderRadius: 'var(--radius-xl)',
          background: 'var(--gradient-card)', border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>¿Listo para modernizar tu farmacia?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 16 }}>
            Únete a cientos de farmacias que ya usan Farmasys para gestionar su negocio.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 16 }}>
            Crea tu cuenta gratis <FiArrowRight style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        textAlign: 'center', padding: '32px 40px', borderTop: '1px solid var(--border-secondary)',
        color: 'var(--text-muted)', fontSize: 13
      }}>
        © {new Date().getFullYear()} Farmasys. Sistema de Gestión de Droguería y Farmacia.
      </footer>
    </div>
  );
}
