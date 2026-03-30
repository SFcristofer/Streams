import { useRouter } from 'next/router';
import Head from 'next/head';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;

  const accountId = 'ycfssauwomlccye1';
  const inputUid = '20d23ae5b415df29bd6850b4de3ee2a1';

  const adHtml = `
    <html>
      <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; background:transparent;">
        <script async="async" data-cfasync="false" src="https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js"></script>
        <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
      </body>
    </html>
  `;

  return (
    <div className="stream-container">
      <Head>
        <title>{`${username || 'Live'} | ChillStream`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <nav className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
          <div className="live-pill">LIVE</div>
        </div>
        <button className="btn-exit" onClick={() => window.location.href = '/'}>Salir</button>
      </nav>

      <main className="main-content">
        {/* LADO IZQUIERDO: VIDEO */}
        <section className="video-section">
          <div className="video-wrapper">
            <iframe
              src={`https://customer-${accountId}.cloudflarestream.com/${inputUid}/iframe?preload=true&autoplay=true&muted=true`}
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          </div>
          
          <div className="details-bar">
            <div className="streamer-info">
              <div className="avatar">{username?.charAt(0).toUpperCase()}</div>
              <div className="meta">
                <h3>{username}</h3>
                <p>Streaming en directo • 1080p 60fps</p>
              </div>
            </div>
            <div className="actions">
              <button className="btn-donate">APOYAR 💎</button>
            </div>
          </div>
        </section>

        {/* LADO DERECHO: CHAT Y ADS */}
        <aside className="sidebar">
          <div className="chat-box">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              <div className="msg"><span className="mod">System:</span> Bienvenido a ChillStream Pro. Disfruta del directo.</div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Envía un mensaje..." disabled />
            </div>
          </div>

          <div className="ad-box-sidebar">
            <span className="ad-label">Patrocinado</span>
            <iframe 
              srcDoc={adHtml}
              width="100%"
              height="250"
              style={{ border: 'none', overflow: 'hidden' }}
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #0a0a0a; --text: #fff; --border: rgba(255,255,255,0.08); }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', -apple-system, sans-serif; }
        
        .stream-container { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        
        .navbar { height: 60px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; border-bottom: 1px solid var(--border); z-index: 100; }
        .nav-left { display: flex; align-items: center; gap: 15px; }
        .logo { font-weight: 900; color: var(--primary); font-size: 1.2rem; cursor: pointer; }
        .live-pill { background: #ff4d4d; color: #fff; font-size: 0.65rem; font-weight: 900; padding: 3px 10px; border-radius: 6px; }
        .btn-exit { background: #111; color: #555; border: 1px solid var(--border); padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; }

        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 350px; gap: 0; height: calc(100vh - 60px); }
        
        .video-section { display: flex; flex-direction: column; background: #000; border-right: 1px solid var(--border); overflow-y: auto; }
        .video-wrapper { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
        
        .details-bar { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; background: #050505; }
        .streamer-info { display: flex; align-items: center; gap: 15px; }
        .avatar { width: 45px; height: 45px; background: var(--primary); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; }
        .meta h3 { margin: 0; font-size: 1.1rem; text-transform: capitalize; }
        .meta p { margin: 0; font-size: 0.75rem; color: #555; font-weight: 500; }
        .btn-donate { background: linear-gradient(45deg, #ffd700, #ffae00); color: #000; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; cursor: pointer; }

        .sidebar { background: #080808; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; }
        .chat-box { flex: 1; background: var(--card); border-radius: 20px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 15px; background: #111; text-align: center; font-size: 0.7rem; color: #444; font-weight: 900; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 1.2rem; display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem; }
        .mod { color: var(--primary); font-weight: 800; margin-right: 8px; }
        .chat-input { padding: 1rem; border-top: 1px solid var(--border); }
        .chat-input input { width: 100%; background: #111; border: 1px solid #222; color: #fff; padding: 12px; border-radius: 12px; font-size: 0.9rem; outline: none; }

        .ad-box-sidebar { background: var(--card); border-radius: 20px; padding: 10px; border: 1px solid var(--border); text-align: center; }
        .ad-label { font-size: 0.55rem; color: #333; font-weight: bold; display: block; margin-bottom: 8px; text-transform: uppercase; }

        /* RESPONSIVO PARA TABLETS Y MÓVILES */
        @media (max-width: 1024px) {
          .main-content { grid-template-columns: 1fr; overflow-y: auto; }
          .video-section { border-right: none; position: sticky; top: 0; z-index: 100; }
          .sidebar { min-height: 500px; overflow-y: visible; }
          .stream-container { overflow-y: auto; }
        }

        @media (max-width: 480px) {
          .details-bar { padding: 1rem; }
          .avatar { width: 35px; height: 35px; border-radius: 10px; font-size: 1rem; }
          .meta h3 { font-size: 0.9rem; }
          .btn-donate { padding: 8px 16px; font-size: 0.7rem; }
          .sidebar { padding: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
