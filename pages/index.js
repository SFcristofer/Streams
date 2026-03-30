import Head from 'next/head';
import { useState, useEffect } from 'react';
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
        <title>ChillStream | Streaming Privado</title>
      </Head>

      <nav className="navbar">
        <div className="logo">🎮 Chill<span>Stream</span></div>
      </nav>

      <main>
        {/* BANNER PASIVO SUPERIOR (320x50) */}
        <div className="passive-banner-top">
          <div id="banner-top-container">
            <Script id="at-options-home" strategy="afterInteractive">
              {`
                atOptions = {
                  'key' : '1da0e70a20c4240ea69ce193167c37f5',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              `}
            </Script>
            <Script src="https://www.highperformanceformat.com/1da0e70a20c4240ea69ce193167c37f5/invoke.js" strategy="afterInteractive" />
          </div>
        </div>

        <div className="hero">
          <h1 className="title">Streaming <span className="gradient-text">Privado</span></h1>
          <p className="description">La mejor calidad sin interrupciones molestas.</p>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Ingresar a Sala</h3>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Nombre del streamer..." 
                value={streamerName}
                onChange={(e) => setStreamerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && goToStream()}
              />
              <button className="primary-btn" onClick={goToStream}>Entrar</button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: sans-serif; }
        .container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 60px; }
        .navbar { position: absolute; top: 0; padding: 1.5rem; width: 100%; text-align: center; }
        .logo { font-weight: 800; font-size: 1.2rem; color: var(--primary); }
        
        .passive-banner-top { margin-bottom: 2rem; background: #111; padding: 10px; border-radius: 10px; border: 1px solid #222; min-width: 320px; min-height: 50px; display: flex; justify-content: center; align-items: center; }
        
        .title { font-size: 3.5rem; font-weight: 900; margin: 0; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .description { color: #555; font-size: 1.1rem; }
        .card { background: #111; padding: 2rem; border-radius: 20px; border: 1px solid #222; width: 400px; margin-top: 1rem; }
        .input-group { display: flex; gap: 10px; margin-top: 1rem; }
        input { flex: 1; background: #000; border: 1px solid #333; padding: 12px; color: #fff; border-radius: 10px; outline: none; }
        .primary-btn { background: var(--primary); color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
}
