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
      </nav>

      <main>
        <div className="hero">
          <h1 className="title">Streaming <span className="gradient-text">Privado</span></h1>
          <p className="description">Sin pop-ups molestas. Solo contenido directo.</p>
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

        {/* Solo un banner estático muy pequeño al final */}
        <div className="ad-footer">
          <div id="container-banner-small">
            <Script id="banner-320-50-config" strategy="afterInteractive">
              {`atOptions = { 'key' : '1da0e70a20c4240ea69ce193167c37f5', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`}
            </Script>
            <Script src="https://www.highperformanceformat.com/1da0e70a20c4240ea69ce193167c37f5/invoke.js" strategy="afterInteractive" />
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: sans-serif; }
        .container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .navbar { position: absolute; top: 0; padding: 2rem; width: 100%; text-align: center; }
        .logo { font-weight: 800; font-size: 1.5rem; color: var(--primary); }
        .title { font-size: 4rem; font-weight: 900; margin: 0; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .description { color: #555; }
        .card { background: #111; padding: 2rem; border-radius: 20px; border: 1px solid #222; width: 400px; margin-top: 2rem; }
        .input-group { display: flex; gap: 10px; margin-top: 1rem; }
        input { flex: 1; background: #000; border: 1px solid #333; padding: 12px; color: #fff; border-radius: 10px; outline: none; }
        .primary-btn { background: var(--primary); color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
        .ad-footer { margin-top: 4rem; opacity: 0.3; }
      `}</style>
    </div>
  );
}
