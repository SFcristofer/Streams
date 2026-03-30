import Head from 'next/head';
import { useState } from 'react';
import Script from 'next/script';

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
            Entra, relájate y disfruta del contenido sin ventanas emergentes molestas.
          </p>
        </div>

        <div className="grid">
          <div className="card main-card">
            <div className="card-content">
              <h3>🔑 Acceso Directo</h3>
              <p>Introduce el nombre de la sala.</p>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Nombre del streamer..." 
                  value={streamerName}
                  onChange={(e) => setStreamerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && goToStream()}
                />
                <button className="primary-btn" onClick={goToStream}>Entrar 🔓</button>
              </div>
            </div>
          </div>
        </div>

        {/* Banner estático NO intrusivo al final */}
        <div className="ad-footer-home">
          <div id="at-options-wrapper">
            <Script id="banner-home-options" strategy="afterInteractive">
              {`atOptions = { 'key' : '1da0e70a20c4240ea69ce193167c37f5', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`}
            </Script>
            <Script src="https://www.highperformanceformat.com/1da0e70a20c4240ea69ce193167c37f5/invoke.js" strategy="afterInteractive" />
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --background: #050505; --card-bg: #111; --text: #fff; }
        body { margin: 0; background: var(--background); color: var(--text); font-family: sans-serif; }
        .container { min-height: 100vh; display: flex; flex-direction: column; background: radial-gradient(circle at top, #111, #050505); }
        .navbar { display: flex; justify-content: space-between; padding: 1.5rem 2rem; }
        .logo { font-size: 1.5rem; font-weight: 800; }
        .logo span { color: var(--primary); }
        main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        .title { font-size: 4rem; font-weight: 900; text-align: center; margin-bottom: 1rem; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grid { width: 100%; max-width: 500px; }
        .card { background: var(--card-bg); border: 1px solid #222; border-radius: 20px; padding: 2rem; }
        .input-group { display: flex; gap: 10px; margin-top: 1rem; }
        input { flex: 1; background: #111; border: 1px solid #333; border-radius: 10px; padding: 12px; color: #fff; outline: none; }
        input:focus { border-color: var(--primary); }
        .primary-btn { background: var(--primary); color: #fff; border: none; border-radius: 10px; padding: 12px 20px; font-weight: bold; cursor: pointer; }
        .ad-footer-home { margin-top: 3rem; min-height: 50px; }
      `}</style>
    </div>
  );
}
