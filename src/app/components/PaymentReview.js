'use client';

export default function PaymentReview({ data, onPaymentSelect, onBack, onPlaceOrder, loading, error }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment & Review</h2>

      <div style={styles.card}>
        <h3>Cart Items:</h3>
        <ul>
          {data.cartItems.map(item => (
            <li key={item.id}>{item.name} x {item.qty} = ${(item.price * item.qty).toFixed(2)}</li>
          ))}
        </ul>
        <h3>Total: ${data.totalAmount}</h3>
      </div>

      <div style={styles.card}>
        <h3>Payment Method:</h3>
        {['COD','Card'].map(method => (
          <label key={method} style={styles.radioLabel}>
            <input type="radio" checked={data.paymentMethod===method} onChange={() => onPaymentSelect(method)} /> {method==='COD' ? 'Cash on Delivery' : 'Credit/Debit Card'}
          </label>
        ))}
      </div>

      {error && <p style={{color:'red'}}>{error}</p>}

      <div style={styles.buttonGroup}>
        <button onClick={onBack} style={{...styles.button, backgroundColor:'#6c757d'}} disabled={loading}>Back</button>
        <button onClick={onPlaceOrder} style={styles.button} disabled={loading}>
          {loading?'Placing Order...':'Place Order'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', flexDirection:'column', gap:'20px' },
  heading: { fontSize:'1.5em', color:'#343a40' },
  card: { padding:'20px', borderRadius:'10px', backgroundColor:'#f8f9fa', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' },
  radioLabel: { display:'block', marginBottom:'10px', fontSize:'1em', cursor:'pointer' },
  buttonGroup: { display:'flex', gap:'15px', flexWrap:'wrap', justifyContent:'flex-end' },
  button: { padding:'12px 20px', backgroundColor:'#007bff', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1em', fontWeight:'600', cursor:'pointer', transition:'background 0.2s' },
};
