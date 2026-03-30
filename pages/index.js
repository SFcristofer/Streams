import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');

  const featuredStreams = [
    { id: 1, name: 'Cristian', viewers: '1.2k', title: 'Chill & Games 🎮', thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Elite_Gamer', viewers: '850', title: 'Noche de Terror 👻', thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Relax_Mode', viewers: '2.4k', title: 'Solo Música para Estudiar 🎧', thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  ];

  const goToStream = (name) => {
    window.location.href = `/stream/${name.toLowerCase()}`;
  };

  return (
    <div className="container">
      <Head>
        <title>ChillStream | El Futuro del Streaming Privado</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <div className="nav-actions">
          <button className="btn-be-streamer" onClick={() => window.location.href = '/empezar'}>🚀 Quiero ser Streamer</button>
          <button className="btn-login-nav" onClick={() => setShowAuth(true)}>Entrar</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <span className="badge">PLATAFORMA ELITE</span>
          <h1 className="title">Streaming <span className="gradient-text">Sin Censura</span></h1>
          <p>La red exclusiva donde el contenido es de verdad. Únete hoy.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setShowAuth(true)}>Ver Canales</button>
            <button className="btn-secondary" onClick={() => window.location.href = '/empezar'}>Emitir en Directo</button>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="live-section">
          <div className="section-header">
            <h2>🔴 Streams Destacados</h2>
            <span className="live-indicator">LIVE</span>
          </div>
          <div className="stream-grid">
            {featuredStreams.map(stream => (
              <div key={stream.id} className="stream-card" onClick={() => goToStream(stream.name)}>
                <div className="thumbnail-wrapper">
                  <img src={stream.thumb} alt={stream.title} />
                  <span className="viewers">👁️ {stream.viewers}</span>
                </div>
                <div className="stream-info">
                  <div className="avatar">{stream.name.charAt(0)}</div>
                  <div className="text">
                    <h4>{stream.title}</h4>
                    <p>{stream.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL DE ACCESO */}
      {showAuth && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <button className="close-btn" onClick={() => setShowAuth(false)}>×</button>
            <h2>Bienvenido</h2>
            <p>Escribe el nombre de la sala para entrar</p>
            <input 
              type="text" 
              placeholder="Nombre de la sala..." 
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && roomName && goToStream(roomName)}
            />
            <button className="btn-join" onClick={() => roomName && goToStream(roomName)}>
              ENTRAR AL STREAM
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2026 ChillStream. Desarrollado para la comunidad privada.</p>
      </footer>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; --border: rgba(255,255,255,0.08); }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; }
        
        .navbar { height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 5%; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid var(--border); }
        .logo { font-weight: 900; font-size: 1.4rem; letter-spacing: -1px; cursor: pointer; }
        .logo span { color: var(--primary); }
        .nav-actions { display: flex; gap: 15px; }
        .btn-be-streamer { background: transparent; color: #fff; border: 1px solid var(--primary); padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.8rem; }
        .btn-be-streamer:hover { background: var(--primary); }
        .btn-login-nav { background: var(--primary); border: none; color: #fff; padding: 8px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.8rem; }

        .hero { min-height: 60vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
        .badge { background: rgba(0,112,243,0.1); color: var(--primary); padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid rgba(0,112,243,0.2); }
        .title { font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 900; letter-spacing: -3px; line-height: 1; margin: 1rem 0; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-btns { display: flex; gap: 15px; justify-content: center; margin-top: 2rem; }
        .btn-primary { background: var(--primary); border: none; color: #fff; padding: 15px 35px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .btn-secondary { background: #111; border: 1px solid var(--border); color: #fff; padding: 15px 35px; border-radius: 12px; font-weight: 800; cursor: pointer; }

        .content { max-width: 1400px; margin: 0 auto; padding: 2rem 5%; }
        .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 2rem; }
        .live-indicator { background: #ff4d4d; font-size: 0.6rem; font-weight: 900; padding: 3px 8px; border-radius: 4px; }

        .stream-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
        .stream-card { background: var(--card); border-radius: 16px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; transition: 0.3s; }
        .stream-card:hover { transform: translateY(-10px); border-color: var(--primary); }
        .thumbnail-wrapper { position: relative; padding-top: 56.25%; }
        .thumbnail-wrapper img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .viewers { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; }
        .stream-info { padding: 1.2rem; display: flex; gap: 12px; }
        .avatar { width: 40px; height: 40px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .text h4 { margin: 0; font-size: 1rem; }
        .text p { margin: 5px 0 0 0; font-size: 0.8rem; color: #555; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .auth-modal { background: #111; padding: 3rem; border-radius: 32px; border: 1px solid var(--border); width: 100%; max-width: 450px; text-align: center; position: relative; }
        .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }
        .auth-modal input { width: 100%; background: #000; border: 1px solid #222; padding: 15px; border-radius: 12px; color: #fff; margin-bottom: 1rem; outline: none; }
        .btn-join { width: 100%; background: var(--primary); border: none; color: #fff; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; }

        .footer { padding: 4rem; text-align: center; color: #333; }

        @media (max-width: 768px) {
          .nav-actions { display: none; }
          .hero { padding-top: 100px; }
          .stream-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
