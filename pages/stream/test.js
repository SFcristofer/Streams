export default function TestPage() {
  return (
    <div style={{ background: 'black', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexDirection: 'column' }}>
      <h1>SISTEMA DE RUTAS ACTIVO ✅</h1>
      <p>Si ves esto, Next.js está funcionando correctamente.</p>
      <button onClick={() => window.location.href = '/'}>Volver al Inicio</button>
    </div>
  );
}
