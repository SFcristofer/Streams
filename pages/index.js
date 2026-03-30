import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [streamerName, setStreamerName] = useState('');

  const goToStream = () => {
    if (streamerName.trim()) {
      window.location.href = `/stream/${streamerName.trim().toLowerCase()}`;
    }
  };

  // Código del banner encerrado en un Sandbox para evitar redirecciones
  const adHtml = `
    <html>
      <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; background:transparent;">
        <script async="async" data-cfasync="false" src="https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js"></script>
        <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
      </body>
    </html>
  `;

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
        {/* IFRAME SANDBOX: Esto impide que el anuncio cambie la URL del sitio principal */}
        <div className="safe-ad-box">
          <span className="ad-tag">Sponsor</span>
          <iframe 
            srcDoc={adHtml}
            width="300"
            height="250"
            style={{ border: 'none', overflow: 'hidden' }}
            sandbox="allow-scripts allow-forms allow-same-origin" // BLOQUEA popups y redirecciones
          />
        </div>

        <div className="hero">
          <h1 className="title">Streaming <span className="gradient-text">Privado</span></h1>
          <p className="description">Navegación protegida. Sin redirecciones automáticas.</p>
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
        .container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .navbar { position: absolute; top: 0; padding: 1.5rem; width: 100%; text-align: center; }
        .logo { font-weight: 800; font-size: 1.2rem; color: var(--primary); }
        .safe-ad-box { margin-bottom: 2rem; background: #111; padding: 10px; border-radius: 12px; border: 1px solid #222; text-align: center; }
        .ad-tag { font-size: 0.5rem; color: #444; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 5px; }
        .title { font-size: 3.5rem; font-weight: 900; margin: 0; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .description { color: #555; margin-top: 0.5rem; }
        .card { background: #111; padding: 2rem; border-radius: 20px; border: 1px solid #222; width: 400px; margin-top: 1rem; }
        .input-group { display: flex; gap: 10px; margin-top: 1rem; }
        input { flex: 1; background: #000; border: 1px solid #333; padding: 12px; color: #fff; border-radius: 10px; outline: none; }
        .primary-btn { background: var(--primary); color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
}
