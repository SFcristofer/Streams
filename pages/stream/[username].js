import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Nota: En un entorno de producción real, instalarías videojs-ima y videojs-contrib-ads
// para manejar los anuncios de forma automática. Aquí simularemos el flujo profesional.

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const chatEndRef = useRef(null);
  
  const [inputValue, setInputValue] = useState('');
  const [adPlaying, setAdPlaying] = useState(true); // Controlamos si hay comercial activo
  const [adTimeLeft, setAdTimeLeft] = useState(15); // Duración del comercial

  const [messages, setMessages] = useState([
    { id: 1, user: 'Admin', text: `¡Bienvenidos al stream de ${username || 'Cargando...'}!`, color: '#0070f3' },
    { id: 2, user: 'Bot_Vip', text: 'Viendo comercial para apoyar al canal 📺', color: '#ff4d4d' },
  ]);

  const streamUrl = `https://customer-ycfssauwomlccye1.cloudflarestream.com/20d23ae5b415df29bd6850b4de3ee2a1/manifest/video.m3u8`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Lógica del comercial (Pre-roll)
  useEffect(() => {
    if (adPlaying && adTimeLeft > 0) {
      const timer = setTimeout(() => setAdTimeLeft(adTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (adTimeLeft === 0) {
      setAdPlaying(false);
      initStream(); // Iniciamos el stream real cuando termina el anuncio
    }
  }, [adPlaying, adTimeLeft]);

  const initStream = () => {
    if (!videoRef.current || !username) return;
    if (playerRef.current) playerRef.current.dispose();

    const player = videojs(videoRef.current, {
      autoplay: true,
      muted: false, // Ahora que el usuario ya interactuó con el anuncio, podemos intentar audio
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{ src: streamUrl, type: 'application/x-mpegURL' }]
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
        <title>{`${username || 'Stream'} | ChillStream`}</title>
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
            
            {/* CAPA DE COMERCIAL (Lo que te da más dinero) */}
            {adPlaying && (
              <div className="ad-overlay">
                <div className="ad-header">
                  <span>PUBLICIDAD</span>
                  <span className="timer">El stream comenzará en: {adTimeLeft}s</span>
                </div>
                <div className="ad-content">
                  {/* Aquí es donde Adsterra o Google IMA cargarían el video real */}
                  <div className="ad-video-mock">
                    <div className="play-icon">🎬</div>
                    <h3>Cargando Comercial de Alta Rentabilidad...</h3>
                    <p>Este anuncio apoya directamente al creador de contenido.</p>
                  </div>
                </div>
              </div>
            )}

            <div data-vjs-player style={{ visibility: adPlaying ? 'hidden' : 'visible' }}>
              <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-city" playsInline />
            </div>
          </div>
          
          <div className="video-footer">
            <div className="video-details">
              <div className="details-text">
                <h2>🔴 {username} - Streaming Premium</h2>
                <p className="live-meta">Calidad 1080p | {adPlaying ? 'Viendo Anuncio...' : 'En Directo'}</p>
              </div>
              <div className="action-buttons">
                 <button className="btn-action primary">Suscribirse</button>
                 <button className="btn-action donate">Donar 💎</button>
              </div>
            </div>

            <div className="ad-horizontal">
              <span className="ad-label">Sponsor Oficial</span>
              <div className="ad-box-h">
                 <p>Banner 728x90 Adsterra</p>
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

          <div className="ad-sidebar">
            <span className="ad-label">Anuncio Destacado</span>
            <div className="ad-box-v">
               <p>300x250 Adsterra</p>
            </div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card-bg: #111; --border: #222; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; }
        .logo { font-weight: 800; cursor: pointer; color: var(--primary); font-size: 1.1rem; }
        .status-dot { width: 8px; height: 8px; background: #ff4d4d; border-radius: 50%; box-shadow: 0 0 10px #ff4d4d; }
        
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 300px; gap: 0.75rem; padding: 0.75rem; overflow: hidden; }
        
        .video-section { display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; }
        .video-wrapper { position: relative; background: #000; border-radius: 12px; overflow: hidden; min-height: 400px; }
        
        /* OVERLAY DE COMERCIAL (PRE-ROLL) */
        .ad-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #000;
          z-index: 50;
          display: flex;
          flex-direction: column;
        }
        .ad-header {
          padding: 10px 20px;
          background: rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: bold;
          color: #888;
        }
        .timer { color: var(--primary); }
        .ad-content { flex: 1; display: flex; align-items: center; justify-content: center; }
        .ad-video-mock { text-align: center; color: #444; }
        .play-icon { font-size: 4rem; margin-bottom: 1rem; }
        .ad-video-mock h3 { color: #fff; margin: 0; }

        .video-details { background: var(--card-bg); padding: 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
        .details-text h2 { margin: 0; font-size: 1.1rem; }
        .live-meta { margin-top: 4px; font-size: 0.7rem; color: #555; }
        .btn-action { padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; font-size: 0.8rem; margin-left: 8px; }
        .btn-action.primary { background: var(--primary); color: #fff; }
        .btn-action.donate { background: #ffd700; color: #000; }

        .ad-horizontal { background: #0a0a0a; border-radius: 12px; padding: 8px; border: 1px solid #1a1a1a; text-align: center; }
        .ad-label { font-size: 0.55rem; color: #333; font-weight: bold; display: block; margin-bottom: 4px; }
        .ad-box-h { height: 60px; background: #080808; border: 1px dashed #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #222; font-size: 0.7rem; }

        .sidebar { display: flex; flex-direction: column; gap: 0.75rem; }
        .chat-container { flex: 1; background: var(--card-bg); border-radius: 12px; display: flex; flex-direction: column; border: 1px solid var(--border); overflow: hidden; }
        .chat-header { padding: 10px; background: #111; text-align: center; font-size: 0.65rem; color: #444; font-weight: 900; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 0.75rem; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .message { font-size: 0.8rem; line-height: 1.4; background: rgba(255,255,255,0.02); padding: 6px; border-radius: 6px; }
        .chat-input { padding: 10px; border-top: 1px solid var(--border); display: flex; gap: 8px; background: #0a0a0a; }
        .chat-input input { flex: 1; background: #111; border: 1px solid #222; color: #fff; padding: 8px; border-radius: 8px; outline: none; }
        .chat-input button { background: var(--primary); border: none; color: #fff; padding: 0 12px; border-radius: 8px; cursor: pointer; }

        .ad-sidebar { background: var(--card-bg); border-radius: 12px; padding: 10px; border: 1px solid var(--border); text-align: center; }
        .ad-box-v { height: 180px; background: #080808; border: 1px dashed #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #222; font-size: 0.7rem; font-weight: 900; }
      `}</style>
    </div>
  );
}
