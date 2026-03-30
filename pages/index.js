import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [streamerName, setStreamerName] = useState('');

  const goToStream = () => {
    if (streamerName.trim()) {
      window.location.href = `/stream/${streamerName.trim().toLowerCase()}`;
    }
  };

  return (
    <div className="container">
      <Head>
        <title>ChillStream | Elite Streaming</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className="navbar">
        <div className="logo">🎮 Chill<span>Stream</span></div>
        <div className="nav-links">
          <span className="live-indicator">● LIVE NOW</span>
        </div>
      </nav>

      <main>
        <div className="hero">
          <h1 className="title">
            Streaming <span className="gradient-text">Privado</span> <br /> 
            para Amigos
          </h1>
          <p className="description">
            La plataforma exclusiva donde el relax y la diversión no tienen filtros.
          </p>
        </div>

        <div className="grid">
          <div className="card main-card">
            <div className="card-content">
              <h3>🔑 Acceso Directo</h3>
              <p>Introduce el nombre de la sala para unirte al instante.</p>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Nombre del streamer..." 
                  value={streamerName}
                  onChange={(e) => setStreamerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && goToStream()}
                />
                <button className="primary-btn" onClick={goToStream}>
                  Entrar 🔓
                </button>
              </div>
            </div>
          </div>

          <div className="card secondary-card">
            <div className="card-content">
              <h3>💰 Free Pass</h3>
              <p>¿Sin invitación? Desbloquea una sala aleatoria viendo un corto.</p>
              <button className="secondary-btn">
                Ver Anuncio y Entrar
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 ChillStream Lab - Hecho para la comunidad.</p>
      </footer>

      <style jsx global>{`
        :root {
          --primary: #0070f3;
          --primary-glow: rgba(0, 112, 243, 0.4);
          --background: #050505;
          --card-bg: #111111;
          --text: #ffffff;
          --text-muted: #888888;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          padding: 0;
          background: var(--background);
          color: var(--text);
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          overflow-x: hidden;
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: radial-gradient(circle at top center, #111 0%, #050505 100%);
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .logo span { color: var(--primary); }

        .live-indicator {
          font-size: 0.8rem;
          background: rgba(255, 0, 0, 0.1);
          color: #ff4d4d;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 0, 0, 0.2);
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero { text-align: center; margin-bottom: 4rem; }

        .title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 1.5rem;
          letter-spacing: -2px;
        }

        .gradient-text {
          background: linear-gradient(90deg, #0070f3, #00dfd8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
          width: 100%;
          max-width: 900px;
        }

        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; }
        }

        .card {
          background: var(--card-bg);
          border: 1px solid #222;
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at top left, var(--primary-glow), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card:hover {
          border-color: var(--primary);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .card:hover::before { opacity: 0.5; }

        .card-content { position: relative; z-index: 1; }

        .card h3 { margin-top: 0; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .card p { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem; }

        .input-group { display: flex; gap: 10px; }

        input {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .primary-btn {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 14px 0 var(--primary-glow);
        }

        .primary-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 118, 255, 0.4);
        }

        .secondary-btn {
          width: 100%;
          background: #222;
          color: white;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .secondary-btn:hover { background: #333; border-color: #444; }

        .footer {
          padding: 2rem;
          text-align: center;
          color: #444;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
