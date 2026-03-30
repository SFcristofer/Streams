import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [streamerName, setStreamerName] = useState('');

  const goToStream = () => {
    if (streamerName.trim()) {
      window.location.href = `/stream/${streamerName.trim().toLowerCase()}`;
    }
  };

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
        <title>ChillStream | Streaming Móvil</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <nav className="navbar">
        <div className="logo">🎮 Chill<span>Stream</span></div>
      </nav>

      <main>
        <div className="safe-ad-box">
          <span className="ad-tag">Sponsor</span>
          <iframe 
            srcDoc={adHtml}
            width="300"
            height="250"
            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
            sandbox="allow-scripts allow-forms allow-same-origin"
          />
        </div>

        <div className="hero">
          <h1 className="title">Stream <span className="gradient-text">Pro</span></h1>
          <p className="description">Tu contenido favorito, ahora en tu móvil.</p>
        </div>

        <div className="card">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nombre del streamer..." 
              value={streamerName}
              onChange={(e) => setStreamerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && goToStream()}
            />
            <button className="primary-btn" onClick={goToStream}>Ir 🔓</button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: sans-serif; }
        .container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; }
        .navbar { position: absolute; top: 0; padding: 1.5rem; width: 100%; text-align: center; }
        .logo { font-weight: 800; font-size: 1.5rem; color: var(--primary); }
        
        .safe-ad-box { margin-bottom: 1.5rem; background: #111; padding: 10px; border-radius: 12px; border: 1px solid #222; width: 100%; max-width: 320px; }
        .ad-tag { font-size: 0.5rem; color: #444; display: block; margin-bottom: 5px; text-transform: uppercase; }

        .hero { text-align: center; margin-bottom: 1.5rem; }
        .title { font-size: 3rem; font-weight: 900; margin: 0; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .description { color: #555; font-size: 1rem; margin-top: 5px; }

        .card { background: #111; padding: 1.5rem; border-radius: 20px; border: 1px solid #222; width: 100%; max-width: 400px; }
        .input-group { display: flex; gap: 8px; }
        input { flex: 1; background: #000; border: 1px solid #333; padding: 14px; color: #fff; border-radius: 12px; outline: none; font-size: 1rem; }
        .primary-btn { background: var(--primary); color: #fff; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; }

        @media (max-width: 480px) {
          .title { font-size: 2.5rem; }
          .navbar { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
