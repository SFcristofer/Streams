import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const chatEndRef = useRef(null);
  
  const [inputValue, setInputValue] = useState('');
  const [adPlaying, setAdPlaying] = useState(true);
  const [adTimeLeft, setAdTimeLeft] = useState(15);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Admin', text: `¡Bienvenidos al stream de ${username || 'Cargando...'}!`, color: '#0070f3' },
    { id: 2, user: 'Bot_Vip', text: 'Viendo comercial para apoyar al canal 📺', color: '#ff4d4d' },
  ]);

  const streamUrl = `https://customer-ycfssauwomlccye1.cloudflarestream.com/20d23ae5b415df29bd6850b4de3ee2a1/manifest/video.m3u8`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Manejo del contador del anuncio
  useEffect(() => {
    if (adPlaying && adTimeLeft > 0) {
      const timer = setTimeout(() => setAdTimeLeft(adTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (adTimeLeft === 0) {
      setAdPlaying(false); // Primero ocultamos el anuncio
    }
  }, [adPlaying, adTimeLeft]);

  // IMPORTANTE: Solo iniciamos el stream cuando adPlaying es FALSE y el DOM está listo
  useEffect(() => {
    if (!adPlaying && username && videoRef.current) {
      // Pequeña espera para asegurar que el DOM se renderizó tras quitar el hidden
      const timer = setTimeout(() => {
        initStream();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [adPlaying, username]);

  const initStream = () => {
    if (!videoRef.current) return;
    
    // Limpiar reproductor previo si existe
    if (playerRef.current) {
      playerRef.current.dispose();
    }

    console.log("Iniciando stream real...");

    const player = videojs(videoRef.current, {
      autoplay: true,
      muted: false,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      html5: {
        vhs: { overrideNative: true, withCredentials: false }
      },
      sources: [{ src: streamUrl, type: 'application/x-mpegURL' }]
    });

    player.on('error', () => {
      console.error("Error en reproductor. Intentando reconectar...");
      setTimeout(() => {
        player.src({ src: streamUrl, type: 'application/x-mpegURL' });
      }, 3000);
    });

    playerRef.current = player;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { id: Date.now(), user: 'Tú', text: inputValue, color: '#00ff00' }]);
      setInputValue('');
    }
  };

  return (
    <div className="stream-container">
      <Head>
        <title>{`${username || 'Cargando'} | ChillStream`}</title>
      </Head>

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <div className="streamer-info">
          <span className="status-dot"></span>
          <span className="streamer-name">{username}</span>
        </div>
        <button className="btn-exit" onClick={() => window.location.href = '/'}>Salir</button>
      </nav>

      <main className="main-content">
        <section className="video-section">
          <div className="video-wrapper">
            <div className="ambient-glow"></div>
            {adPlaying ? (
              <div className="ad-overlay">
                <div className="ad-header">
                  <span>PUBLICIDAD OBLIGATORIA</span>
                  <span className="timer">El stream empezará en: {adTimeLeft}s</span>
                </div>
                <div className="ad-content">
                  <div className="ad-video-mock">
                    <div className="play-icon">🎬</div>
                    <h3>Comercial Premium</h3>
                    <p>Gracias por apoyar el streaming independiente.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div data-vjs-player>
                <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-city" playsInline />
              </div>
            )}
          </div>
          
          <div className="video-footer">
            <div className="video-details">
              <div className="details-text">
                <h2>🔴 {username} - Transmisión en Vivo</h2>
                <p className="live-meta">Servidor: Cloudflare Edge | Calidad: HD</p>
              </div>
              <div className="action-buttons">
                 <button className="btn-action reload" onClick={initStream}>🔄 Recargar</button>
                 <button className="btn-action donate">Donar 💎</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <div className="chat-container">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className="message">
                  <span className="user" style={{color: msg.color}}>{msg.user}:</span>
                  <span className="text">{msg.text}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input">
              <input 
                type="text" 
                placeholder="Chat..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>✈️</button>
            </div>
          </div>
          
          <div className="ad-sidebar-real">
            <span className="ad-label">Patrocinado</span>
            <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card-bg: #111; --border: #222; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: sans-serif; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; }
        .logo { font-weight: 800; cursor: pointer; color: var(--primary); }
        .status-dot { width: 8px; height: 8px; background: #ff4d4d; border-radius: 50%; box-shadow: 0 0 10px #ff4d4d; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 300px; gap: 0.75rem; padding: 0.75rem; overflow: hidden; }
        .video-section { display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; }
        .video-wrapper { position: relative; background: #000; border-radius: 12px; overflow: hidden; min-height: 400px; }
        .ad-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #000; z-index: 50; display: flex; flex-direction: column; }
        .ad-header { padding: 10px 20px; background: rgba(255,255,255,0.05); display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; }
        .timer { color: var(--primary); font-weight: bold; }
        .ad-content { flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; }
        .play-icon { font-size: 3rem; margin-bottom: 1rem; color: #222; }
        .video-details { background: var(--card-bg); padding: 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
        .details-text h2 { margin: 0; font-size: 1.1rem; }
        .live-meta { margin-top: 4px; font-size: 0.7rem; color: #444; }
        .btn-action { padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; font-size: 0.8rem; margin-left: 8px; }
        .btn-action.reload { background: #1a1a1a; color: #555; border: 1px solid #333; }
        .btn-action.donate { background: #ffd700; color: #000; }
        .sidebar { display: flex; flex-direction: column; gap: 0.75rem; }
        .chat-container { flex: 1; background: var(--card-bg); border-radius: 12px; display: flex; flex-direction: column; border: 1px solid var(--border); overflow: hidden; }
        .chat-header { padding: 10px; background: #111; text-align: center; font-size: 0.65rem; color: #444; font-weight: 900; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 0.75rem; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .message { font-size: 0.8rem; line-height: 1.4; background: rgba(255,255,255,0.02); padding: 6px; border-radius: 6px; }
        .chat-input { padding: 10px; border-top: 1px solid var(--border); display: flex; gap: 8px; background: #0a0a0a; }
        .chat-input input { flex: 1; background: #111; border: 1px solid #222; color: #fff; padding: 8px; border-radius: 8px; outline: none; }
        .chat-input button { background: var(--primary); border: none; color: #fff; padding: 0 12px; border-radius: 8px; cursor: pointer; }
        .ad-sidebar-real { background: var(--card-bg); border-radius: 12px; padding: 5px; border: 1px solid var(--border); text-align: center; min-height: 200px; }
        .ad-label { font-size: 0.55rem; color: #333; font-weight: bold; display: block; margin-bottom: 5px; }
      `}</style>
    </div>
  );
}
