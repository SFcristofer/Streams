import { useState } from 'react';
import Head from 'next/head';

export default function EmpezarStream() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamerName: name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCredentials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Panel de Streamer | ChillStream</title>
      </Head>

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
      </nav>

      <main className="content">
        <div className="setup-grid">
          {/* LADO IZQUIERDO: FORMULARIO */}
          <div className="card main-card">
            {!credentials ? (
              <>
                <h1>Configura tu Sala 🚀</h1>
                <p>Crea tu acceso privado a los servidores de Cloudflare.</p>
                <div className="form">
                  <input 
                    type="text" 
                    placeholder="Tu nombre de Streamer..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button onClick={handleCreate} disabled={loading || !name}>
                    {loading ? 'CONECTANDO CON CLOUDFLARE...' : 'GENERAR CLAVES DE ACCESO'}
                  </button>
                  {error && <p className="error">{error}</p>}
                </div>
              </>
            ) : (
              <div className="credentials fade-in">
                <div className="success-header">
                  <span className="icon">✅</span>
                  <h2>¡Sala Lista!</h2>
                </div>
                
                <div className="cred-field">
                  <label>URL DEL SERVIDOR (RTMPS)</label>
                  <div className="value-box">{credentials.rtmpsUrl}</div>
                </div>

                <div className="cred-field">
                  <label>CLAVE DE TRANSMISIÓN (SECRET)</label>
                  <div className="value-box secret">{credentials.streamKey}</div>
                </div>

                <div className="share-info">
                  <label>URL DE TU SALA PÚBLICA</label>
                  <div className="url-badge">chillstream.com/stream/{name.toLowerCase()}</div>
                </div>

                <button className="btn-new" onClick={() => setCredentials(null)}>Generar otra sala</button>
              </div>
            )}
          </div>

          {/* LADO DERECHO: INSTRUCCIONES */}
          <div className="card side-card">
            <h3>Guía Rápida para OBS</h3>
            <div className="steps">
              <div className="step">
                <div className="num">1</div>
                <p>Abre <strong>OBS Studio</strong> en tu computadora.</p>
              </div>
              <div className="step">
                <div className="num">2</div>
                <p>Ve a <strong>Ajustes &gt; Emisión</strong>.</p>
              </div>
              <div className="step">
                <div className="num">3</div>
                <p>En Servicio elige <strong>Personalizado</strong>.</p>
              </div>
              <div className="step">
                <div className="num">4</div>
                <p>Pega el <strong>Servidor</strong> y la <strong>Clave</strong> que generaste aquí.</p>
              </div>
              <div className="step">
                <div className="num">5</div>
                <p>¡Dale a <strong>Iniciar Transmisión</strong> y ya estás en vivo!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; --border: rgba(255,255,255,0.08); }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; }
        
        .navbar { height: 60px; display: flex; align-items: center; padding: 0 5%; border-bottom: 1px solid var(--border); }
        .logo { font-weight: 900; color: var(--primary); cursor: pointer; }

        .content { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
        
        .setup-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; }

        .card { background: var(--card); padding: 2.5rem; border-radius: 24px; border: 1px solid var(--border); }
        h1 { font-size: 2rem; margin-bottom: 10px; }
        p { color: #666; font-size: 0.9rem; }

        .form { margin-top: 2rem; }
        input { width: 100%; background: #000; border: 1px solid #222; padding: 18px; border-radius: 12px; color: #fff; font-size: 1rem; margin-bottom: 1rem; outline: none; transition: 0.3s; }
        input:focus { border-color: var(--primary); }
        button { width: 100%; background: var(--primary); color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        button:disabled { opacity: 0.5; }

        /* CREDENCIALES */
        .success-header { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; }
        .cred-field { margin-bottom: 1.5rem; }
        label { font-size: 0.65rem; font-weight: 900; color: #444; letter-spacing: 1px; display: block; margin-bottom: 8px; }
        .value-box { background: #000; padding: 15px; border-radius: 10px; font-family: monospace; font-size: 0.85rem; border: 1px solid #222; word-break: break-all; }
        .value-box.secret { color: #ff4d4d; }
        .url-badge { background: rgba(0,112,243,0.1); color: var(--primary); padding: 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(0,112,243,0.2); }
        .btn-new { background: #222; margin-top: 2rem; }

        /* STEPS */
        .steps { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .step { display: flex; gap: 15px; align-items: flex-start; }
        .num { background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; flex-shrink: 0; }
        .step p { margin: 0; color: #888; font-size: 0.85rem; line-height: 1.4; }
        .step p strong { color: #fff; }

        .error { color: #ff4d4d; font-size: 0.8rem; margin-top: 15px; }
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .setup-grid { grid-template-columns: 1fr; }
          .side-card { order: 2; }
        }
      `}</style>
    </div>
  );
}
