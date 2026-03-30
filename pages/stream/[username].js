import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const streamUrl = `https://customer-ycfssauwomlccye1.cloudflarestream.com/20d23ae5b415df29bd6850b4de3ee2a1/manifest/video.m3u8`;

  useEffect(() => {
    if (username && videoRef.current && !playerRef.current) {
      initStream();
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [username]);

  const initStream = () => {
    if (!videoRef.current) return;
    const player = videojs(videoRef.current, {
      autoplay: true,
      muted: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{ src: streamUrl, type: 'application/x-mpegURL' }]
    });
    playerRef.current = player;
  };

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
            <div data-vjs-player>
              <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-city" playsInline muted />
            </div>
          </div>

          <div className="details-card">
            <div className="text-info">
              <h2>🔴 En Vivo: {username}</h2>
              <p>Calidad: HD | Servidor: Cloudflare Pro</p>
            </div>
            <button className="btn-action donate" onClick={() => alert('¡Gracias por tu apoyo! 💎')}>Apoyar 💎</button>
          </div>
        </section>

        <aside className="sidebar">
          <div className="chat-container">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              <div className="message"><span className="system-user">System:</span> ¡Bienvenido a la sala de {username}! Disfruta del stream sin anuncios.</div>
            </div>
            <div className="chat-input-placeholder">
              <input type="text" placeholder="Escribe un mensaje..." disabled />
              <button disabled>✈️</button>
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
        .video-section { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
        .video-wrapper { position: relative; background: #000; border-radius: 10px; overflow: hidden; }
        
        .details-card { background: var(--card); padding: 1.2rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
        .details-card h2 { margin: 0; font-size: 1.1rem; }
        .details-card p { margin: 5px 0 0 0; font-size: 0.7rem; color: #444; }
        
        .sidebar { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .chat-container { flex: 1; background: var(--card); border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 10px; background: #111; text-align: center; font-size: 0.6rem; color: #444; font-weight: 900; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 10px; font-size: 0.75rem; }
        .system-user { color: var(--primary); font-weight: bold; margin-right: 5px; }
        
        .chat-input-placeholder { padding: 10px; border-top: 1px solid var(--border); display: flex; gap: 5px; opacity: 0.5; }
        .chat-input-placeholder input { flex: 1; background: #000; border: 1px solid var(--border); color: #fff; padding: 8px; border-radius: 5px; }
        .chat-input-placeholder button { background: var(--primary); border: none; color: #fff; padding: 0 10px; border-radius: 5px; }
        
        .btn-action.donate { background: #ffd700; color: #000; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
}
