import { useState } from 'react';

export default function Home() {
  const [inputFormatted, setInputFormatted] = useState('');
  const [inputArray, setInputArray] = useState('');
  const [invoice, setinvoice] = useState(null);

  const handleSubmit = async () => {
    let codigos;
    try {
      if (inputFormatted.trim()) {
        codigos = inputFormatted.trim().split('\n').filter(l => l.trim());
      } else if (inputArray.trim()) {
        codigos = JSON.parse(`[${inputArray}]`);
      } else {
        alert("Ingresa los códigos en alguno de los campos");
        return;
      }
    } catch (error) {
      alert("Error al parsear el formato del segundo input. Asegúrate de que esté entre comillas y separado por comas.");
      return;
    }

    const res = await fetch('/api/procesar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigos }),
    });

    const data = await res.json();
    setinvoice(data);
  };

  return (
    <div style={{
  padding: '2rem',
  fontFamily: 'Segoe UI, sans-serif',
  backgroundColor: 'var(--bg)',
  color: 'var(--fg)',
  minHeight: '100vh',
}}>

  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Decodificación de Códigos de Barras</h1>
  </div>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '700px',
    margin: '0 auto'
  }}>
    <div>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Ingrese un código de barras en cada línea:</label>
      <textarea
        rows={6}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--card-border)',
          backgroundColor: 'var(--card)',
          color: 'var(--fg)',
          resize: 'vertical'
        }}
        placeholder="|* *|\n|**|\n..."
        value={inputFormatted}
        onChange={(e) => setInputFormatted(e.target.value)}
      />
    </div>

    <button
      onClick={handleSubmit}
      style={{
        padding: '12px',
        fontSize: '1rem',
        backgroundColor: 'var(--accent)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
    >
      Procesar
    </button>
  </div>

  {invoice && (
    <div style={{
      marginTop: '2rem',
      backgroundColor: 'var(--card)',
      padding: '1.5rem',
      borderRadius: '10px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      maxWidth: '800px',
      marginInline: 'auto'
    }}>
      <h3 style={{ textAlign: 'center', fontWeight: '600' }}>Factura</h3>

      {invoice.items.length > 0 ? (
        <>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>Producto</th>
                <th style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>Precio Unitario</th>
                <th style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>Cantidad</th>
                <th style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>{item.nombre}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>{item.precio}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>{item.cantidad}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--card-border)' }}>{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{
            textAlign: 'right',
            marginTop: '1rem',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            Total: {invoice.total}
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>No se reconocieron productos válidos.</p>
      )}

      {invoice.errors.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ color: 'var(--danger)', fontWeight: '600' }}>Códigos inválidos:</h4>
          <ul style={{ paddingLeft: '1.2rem' }}>
            {invoice.errors.map((e, i) => (
              <li key={i}><code>{e}</code></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}
</div>
  );
}