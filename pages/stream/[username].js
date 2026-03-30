import { useRouter } from 'next/router';
import Head from 'next/head';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;

  // IDs REALES DE TU CUENTA
  const accountId = 'ycfssauwomlccye1';
  const inputUid = '20d23ae5b415df29bd6850b4de3ee2a1';

  const adHtml = `
    <html>
      <body style="margin:0; padding:0; display:flex; justify-content:center; background:transparent;">
        <script async="async" data-cfasync="false" src="https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js"></script>
        <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
      </body>
    </html>
  `;

  return (
    <div className="stream-container">
      <Head>
        <title>{`${username || 'Live'} | ChillStream`}</title>
      </Head>

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <button className="btn-exit" onClick={() => window.location.href = '/'}>Salir</button>
      </nav>

      <main className="main-content">
        <section className="video-section">
          <div className="video-wrapper">
            {/* REPRODUCTOR OFICIAL DE CLOUDFLARE (Cero errores de formato) */}
            <iframe
              src={`https://customer-${accountId}.cloudflarestream.com/${inputUid}/iframe?preload=true&autoplay=true&muted=true`}
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          </div>
          <div className="details-card">
            <h2>🔴 En Vivo: {username}</h2>
            <button className="btn-action donate" onClick={() => alert('💎 ¡Gracias por el apoyo!')}>Donar 💎</button>
          </div>
        </section>

        <aside className="sidebar">
          <div className="safe-sidebar-ad">
            <span className="ad-label">Patrocinado</span>
            <iframe 
              srcDoc={adHtml}
              width="100%"
              height="250"
              style={{ border: 'none', overflow: 'hidden' }}
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>

          <div className="chat-dummy">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              <div className="message"><span className="system-user">System:</span> ¡Bienvenido a ChillStream!</div>
            </div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; --border: #222; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid var(--border); }
        .logo { font-weight: bold; cursor: pointer; color: var(--primary); }
        .btn-exit { background: #111; color: #555; border: 1px solid var(--border); padding: 5px 15px; border-radius: 5px; cursor: pointer; }
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 300px; gap: 10px; padding: 10px; overflow: hidden; }
        .video-wrapper { position: relative; background: #000; border-radius: 12px; overflow: hidden; padding-top: 56.25%; /* 16:9 Aspect Ratio */ }
        .details-card { background: var(--card); padding: 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); margin-top: 10px; }
        .details-card h2 { margin: 0; font-size: 1.1rem; }
        .sidebar { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .safe-sidebar-ad { background: var(--card); border-radius: 12px; padding: 10px; border: 1px solid var(--border); text-align: center; }
        .ad-label { font-size: 0.5rem; color: #333; display: block; margin-bottom: 5px; font-weight: bold; }
        .chat-dummy { flex: 1; background: var(--card); border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 10px; background: #111; text-align: center; font-size: 0.6rem; color: #444; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 10px; font-size: 0.75rem; }
        .system-user { color: var(--primary); font-weight: bold; }
        .btn-action.donate { background: #ffd700; color: #000; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
}
