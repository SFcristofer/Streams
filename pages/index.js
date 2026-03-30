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
        <title>ChillStream | Elite Streaming</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <nav className="navbar">
        <div className="logo">🎮 Chill<span>Stream</span></div>
      </nav>

      <main className="main-wrapper">
        <div className="safe-ad-box">
          <span className="ad-tag">Patrocinado</span>
          <iframe 
            srcDoc={adHtml}
            width="300"
            height="250"
            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
            sandbox="allow-scripts allow-forms allow-same-origin"
          />
        </div>

        <div className="hero">
          <h1 className="title">Streaming <span className="gradient-text">Elite</span></h1>
          <p className="description">Tu comunidad favorita, en cualquier dispositivo.</p>
        </div>

        <div className="card-glass">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nombre de la sala..." 
              value={streamerName}
              onChange={(e) => setStreamerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && goToStream()}
            />
            <button className="primary-btn" onClick={goToStream}>ENTRAR</button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: rgba(255, 255, 255, 0.03); --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', -apple-system, sans-serif; overflow-x: hidden; }
        
        .container { min-height: 100vh; display: flex; flex-direction: column; background: radial-gradient(circle at top right, #111, #050505); padding: 2rem; position: relative; }
        
        .navbar { width: 100%; max-width: 1400px; margin: 0 auto; display: flex; justify-content: center; padding: 1rem 0; z-index: 10; }
        .logo { font-weight: 900; font-size: 1.5rem; letter-spacing: -1px; }
        .logo span { color: var(--primary); }
        
        .main-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 1400px; margin: 0 auto; padding-top: 40px; }

        .safe-ad-box { margin-bottom: 2rem; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
        .ad-tag { font-size: 0.5rem; color: #444; display: block; margin-bottom: 8px; text-transform: uppercase; font-weight: bold; text-align: center; }

        .hero { text-align: center; margin-bottom: 2.5rem; }
        .title { font-size: clamp(3rem, 10vw, 6rem); font-weight: 900; margin: 0; letter-spacing: -3px; line-height: 1; }
        .gradient-text { background: linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .description { color: #666; font-size: clamp(1rem, 2vw, 1.25rem); margin-top: 15px; }

        .card-glass { background: var(--card); padding: 2rem; border-radius: 32px; border: 1px solid rgba(255,255,255,0.08); width: 100%; max-width: 500px; backdrop-filter: blur(20px); }
        .input-group { display: flex; gap: 12px; }
        input { flex: 1; background: #000; border: 1px solid #222; padding: 18px; color: #fff; border-radius: 20px; outline: none; font-size: 1.1rem; transition: all 0.3s; }
        input:focus { border-color: var(--primary); background: #080808; box-shadow: 0 0 20px rgba(0,112,243,0.1); }
        .primary-btn { background: var(--primary); color: #fff; border: none; padding: 0 32px; border-radius: 20px; font-weight: 800; cursor: pointer; transition: all 0.3s; font-size: 0.9rem; }
        .primary-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,112,243,0.3); }
        .primary-btn:active { transform: scale(0.95); }

        @media (max-width: 768px) {
          .container { padding: 1rem; }
          .navbar { position: relative; padding: 1rem; }
          .main-wrapper { padding-top: 0; }
          .card-glass { padding: 1.25rem; border-radius: 24px; }
          input { padding: 14px; font-size: 1rem; }
          .primary-btn { padding: 0 20px; }
        }
      `}</style>
    </div>
  );
}
