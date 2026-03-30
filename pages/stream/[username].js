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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <button className="btn-exit" onClick={() => window.location.href = '/'}>Salir</button>
      </nav>

      <main className="main-content">
        <section className="video-section">
          <div className="video-wrapper">
            <iframe
              src={`https://customer-${accountId}.cloudflarestream.com/${inputUid}/iframe?preload=true&autoplay=true&muted=true`}
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          </div>
          
          <div className="details-card">
            <div className="text-info">
              <h2>🔴 {username}</h2>
              <p>HD 1080p | Live</p>
            </div>
            <button className="btn-action donate">Donar 💎</button>
          </div>
        </section>

        <aside className="sidebar">
          <div className="chat-container">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              <div className="message"><span className="system-user">System:</span> ¡Bienvenido al stream móvil!</div>
            </div>
            <div className="chat-input-placeholder">
              <input type="text" placeholder="Escribe un mensaje..." disabled />
              <button disabled>✈️</button>
            </div>
          </div>

          <div className="safe-sidebar-ad">
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
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; --border: #222; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui; }
        .stream-container { min-height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid var(--border); }
        .logo { font-weight: bold; cursor: pointer; color: var(--primary); }
        .btn-exit { background: #111; color: #555; border: 1px solid var(--border); padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
        
        .main-content { flex: 1; display: flex; flex-direction: column; padding: 0; }
        
        .video-section { width: 100%; }
        .video-wrapper { position: relative; background: #000; width: 100%; padding-top: 56.25%; }
        
        .details-card { background: var(--card); padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .details-card h2 { margin: 0; font-size: 1.1rem; }
        .details-card p { margin: 0; font-size: 0.7rem; color: #444; }

        .sidebar { flex: 1; display: flex; flex-direction: column; padding: 10px; gap: 10px; background: #080808; }
        .chat-container { flex: 1; background: var(--card); border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; min-height: 300px; }
        .chat-header { padding: 10px; background: #111; text-align: center; font-size: 0.6rem; color: #444; font-weight: 900; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 10px; font-size: 0.75rem; }
        .system-user { color: var(--primary); font-weight: bold; }
        
        .chat-input-placeholder { padding: 10px; border-top: 1px solid var(--border); display: flex; gap: 5px; opacity: 0.5; }
        .chat-input-placeholder input { flex: 1; background: #000; border: 1px solid var(--border); color: #fff; padding: 8px; border-radius: 8px; }
        .chat-input-placeholder button { background: var(--primary); border: none; color: #fff; padding: 0 10px; border-radius: 8px; }

        .safe-sidebar-ad { background: var(--card); border-radius: 12px; padding: 5px; border: 1px solid var(--border); text-align: center; }
        .btn-action.donate { background: #ffd700; color: #000; border: none; padding: 8px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; }

        /* AJUSTES PARA PANTALLAS GRANDES (PC) */
        @media (min-width: 900px) {
          .main-content { display: grid; grid-template-columns: 1fr 320px; padding: 10px; gap: 10px; height: calc(100vh - 50px); }
          .video-wrapper { border-radius: 12px; }
          .details-card { border-radius: 12px; margin-top: 10px; border: 1px solid var(--border); }
          .sidebar { padding: 0; background: transparent; }
        }
      `}</style>
    </div>
  );
}
