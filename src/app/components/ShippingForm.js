'use client';
import { useState } from 'react';

export default function ShippingForm({ initialData, onNext }) {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Shipping Information</h2>
      {['fullName','address','city','zipCode','email'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={handleChange}
          required
          style={styles.input}
        />
      ))}
      <button type="submit" style={styles.button}>Next</button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  heading: { fontSize: '1.5em', color: '#343a40' },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '1em',
    transition: 'border-color 0.2s',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: '600',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
