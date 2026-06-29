import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import api from '../../services/api';
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiUser, FiCheck } from 'react-icons/fi';

export default function NewSale() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [receiptType, setReceiptType] = useState('nota_venta');
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (search.length >= 2) {
      const timer = setTimeout(async () => {
        try { const res = await api.get('/products/search', { params: { q: search } }); setResults(res.data); }
        catch (err) { console.error(err); }
      }, 300);
      return () => clearTimeout(timer);
    } else { setResults([]); }
  }, [search]);

  const loadClients = async () => {
    try { const res = await api.get('/clients'); setClients(res.data); } catch (err) { console.error(err); }
  };

  const addToCart = (product) => {
    const existing = cart.find(c => c.product_id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(c => c.product_id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: parseFloat(product.price), stock: product.stock, quantity: 1, discount: 0 }]);
    }
    setSearch('');
    setResults([]);
  };

  const updateQty = (productId, delta) => {
    setCart(cart.map(c => {
      if (c.product_id === productId) {
        const newQty = c.quantity + delta;
        if (newQty <= 0 || newQty > c.stock) return c;
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const removeItem = (productId) => setCart(cart.filter(c => c.product_id !== productId));

  const subtotal = cart.reduce((sum, c) => sum + (c.price * c.quantity - c.discount), 0);
  const taxRate = 0.12;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;
  const change = paymentMethod === 'cash' && amountPaid ? Math.max(0, parseFloat(amountPaid) - total) : 0;

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const res = await api.post('/sales', {
        client_id: selectedClient || null,
        items: cart.map(c => ({ product_id: c.product_id, quantity: c.quantity, discount: c.discount })),
        discount,
        payment_method: paymentMethod,
        amount_paid: parseFloat(amountPaid) || total,
        receipt_type: receiptType
      });
      setCompletedSale(res.data.sale);
      setMessage({ type: 'success', text: '¡Venta registrada exitosamente!' });
      setCart([]);
      setDiscount(0);
      setAmountPaid('');
      setSelectedClient('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al procesar venta' });
    } finally { setProcessing(false); }
  };

  if (completedSale) {
    return (
      <>
        <Header title="Venta Completada" />
        <div style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36, color: 'var(--accent-400)' }}>
            <FiCheck />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>¡Venta Exitosa!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Comprobante: <strong style={{ color: 'var(--primary-400)' }}>{completedSale.receipt?.receipt_number}</strong>
          </p>
          <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
            <div className="card-body">
              <div className="pos-total-row"><span>Subtotal</span><span>${parseFloat(completedSale.subtotal).toFixed(2)}</span></div>
              <div className="pos-total-row"><span>IVA</span><span>${parseFloat(completedSale.tax).toFixed(2)}</span></div>
              {parseFloat(completedSale.discount) > 0 && <div className="pos-total-row"><span>Descuento</span><span>-${parseFloat(completedSale.discount).toFixed(2)}</span></div>}
              <div className="pos-total-row total"><span>Total</span><span>${parseFloat(completedSale.total).toFixed(2)}</span></div>
              {completedSale.payments?.[0]?.change_amount > 0 && (
                <div className="pos-total-row" style={{ color: 'var(--accent-400)' }}><span>Cambio</span><span>${parseFloat(completedSale.payments[0].change_amount).toFixed(2)}</span></div>
              )}
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setCompletedSale(null)}><FiShoppingCart /> Nueva Venta</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Nueva Venta" subtitle="Punto de venta" />

      {message && <div className={`alert alert-${message.type}`}>{message.text}<button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      <div className="pos-layout">
        {/* Left: Search & Products */}
        <div className="pos-products">
          <div className="pos-search">
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar medicamento por nombre, genérico o lote..." />
          </div>

          {results.length > 0 && (
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
                <tbody>
                  {results.map(p => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => addToCart(p)}>
                      <td><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.generic_name}</div></td>
                      <td>{p.category?.name || '—'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-400)' }}>${parseFloat(p.price).toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td><button className="btn btn-sm btn-primary"><FiPlus /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.length === 0 && cart.length === 0 && (
            <div className="empty-state" style={{ flex: 1 }}>
              <div className="empty-icon"><FiShoppingCart /></div>
              <h3>Buscar productos</h3>
              <p>Escriba el nombre del medicamento para agregarlo a la venta</p>
            </div>
          )}

          {/* Client & Discount */}
          <div className="card" style={{ marginTop: 'auto' }}>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label"><FiUser style={{ verticalAlign: 'middle' }} /> Cliente</label>
                  <select className="form-select" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                    <option value="">Consumidor Final</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.document_id}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Descuento ($)</label>
                  <input className="form-input" type="number" step="0.01" min="0" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cart */}
        <div className="pos-cart">
          <div className="pos-cart-header">
            <h3><FiShoppingCart style={{ verticalAlign: 'middle' }} /> Carrito ({cart.length})</h3>
          </div>

          <div className="pos-cart-items">
            {cart.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}><p style={{ color: 'var(--text-muted)' }}>Carrito vacío</p></div>
            ) : cart.map(item => (
              <div className="pos-cart-item" key={item.product_id}>
                <div className="pos-cart-item-info">
                  <div className="pos-cart-item-name">{item.name}</div>
                  <div className="pos-cart-item-price">${item.price.toFixed(2)} c/u</div>
                </div>
                <div className="pos-cart-qty">
                  <button onClick={() => updateQty(item.product_id, -1)}><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product_id, 1)}><FiPlus /></button>
                </div>
                <span style={{ minWidth: 60, textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button className="btn btn-icon btn-ghost" style={{ width: 28, height: 28, color: 'var(--danger-400)' }} onClick={() => removeItem(item.product_id)}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="pos-cart-totals">
            <div className="pos-total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="pos-total-row"><span>Descuento</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="pos-total-row"><span>IVA (12%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="pos-total-row total"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
          </div>

          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-secondary)' }}>
            <div className="form-row" style={{ gap: 10 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Método de Pago</label>
                <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                  <option value="transfer">Transferencia</option>
                  <option value="mixed">Mixto</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Comprobante</label>
                <select className="form-select" value={receiptType} onChange={(e) => setReceiptType(e.target.value)}>
                  <option value="nota_venta">Nota de Venta</option>
                  <option value="factura">Factura</option>
                </select>
              </div>
            </div>
            {paymentMethod === 'cash' && (
              <div className="form-group" style={{ margin: '10px 0 0' }}>
                <label className="form-label">Monto Recibido</label>
                <input className="form-input" type="number" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder={`$${total.toFixed(2)}`} />
                {change > 0 && <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: 'var(--accent-400)' }}>Cambio: ${change.toFixed(2)}</div>}
              </div>
            )}
          </div>

          <div className="pos-cart-actions">
            <button className="btn btn-success" onClick={handleSubmit} disabled={cart.length === 0 || processing}>
              <FiCheck /> {processing ? 'Procesando...' : `Cobrar $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
