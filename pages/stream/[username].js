import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  
  // Estado para el Chat
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: `¡Bienvenido a la sala de ${username}!`, color: '#0070f3' },
  ]);
  const [inputValue, setInputValue] = useState('');

  // Estado para la Rotación de Anuncios
  const [adKey, setAdKey] = useState(0);

  const accountId = 'ycfssauwomlccye1';
  const inputUid = '20d23ae5b415df29bd6850b4de3ee2a1';

  // LÓGICA DE ROTACIÓN AUTOMÁTICA (Cada 60 segundos)
  useEffect(() => {
    const adTimer = setInterval(() => {
      console.log("Rotando anuncio lateral para maximizar ganancias...");
      setAdKey(prev => prev + 1);
    }, 60000); // 60000ms = 1 minuto

    return () => clearInterval(adTimer);
  }, [username]); // Se reinicia si cambia la sala

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: Date.now(), user: 'Tú', text: inputValue, color: '#00ff00' }]);
      setInputValue('');
    }
  };

  // El HTML del anuncio ahora depende de adKey para forzar la recarga
  const adSidebarHtml = `
    <html>
      <body style="margin:0; padding:0; display:flex; justify-content:center; background:transparent;">
        <!-- AdKey: ${adKey} -->
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
                <p>Streaming 1080p • Rotación Publicitaria Activa</p>
              </div>
            </div>
            <button className="btn-donate">APOYAR 💎</button>
          </div>
        </section>

        <aside className="sidebar">
          {/* BANNER DINÁMICO: Se recarga cada vez que adKey cambia */}
          <div className="ad-box-sidebar">
            <span className="ad-label">Patrocinado (Auto-Refresh)</span>
            <iframe 
              key={adKey} // Esto obliga a React a destruir y crear el iframe de nuevo
              srcDoc={adSidebarHtml}
              width="100%"
              height="250"
              style={{ border: 'none', overflow: 'hidden' }}
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>

          <div className="chat-app">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className="message">
                  <span className="user" style={{ color: msg.color }}>{msg.user}:</span>
                  <span className="text">{msg.text}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Escribe un mensaje..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>✈️</button>
            </div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #0a0a0a; --text: #fff; --border: rgba(255,255,255,0.08); }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; border-bottom: 1px solid var(--border); z-index: 100; }
        .logo { font-weight: 900; color: var(--primary); cursor: pointer; }
        .live-pill { background: #ff4d4d; color: #fff; font-size: 0.6rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; }
        .btn-exit { background: #111; color: #555; border: 1px solid var(--border); padding: 5px 15px; border-radius: 8px; font-size: 0.75rem; cursor: pointer; }
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 350px; gap: 0; height: calc(100vh - 50px); }
        .video-section { display: flex; flex-direction: column; background: #000; border-right: 1px solid var(--border); overflow-y: auto; }
        .video-wrapper { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
        .details-bar { padding: 1rem; display: flex; justify-content: space-between; align-items: center; background: #050505; }
        .avatar { width: 40px; height: 40px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .meta h3 { margin: 0; font-size: 1rem; text-transform: capitalize; }
        .meta p { margin: 0; font-size: 0.7rem; color: #444; }
        .btn-donate { background: linear-gradient(45deg, #ffd700, #ffae00); color: #000; border: none; padding: 8px 20px; border-radius: 10px; font-weight: 800; font-size: 0.75rem; cursor: pointer; }
        .sidebar { background: #080808; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; }
        .chat-app { flex: 1; background: var(--card); border-radius: 20px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 12px; background: #111; text-align: center; font-size: 0.65rem; color: #444; font-weight: 900; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
        .message { font-size: 0.85rem; line-height: 1.4; }
        .user { font-weight: 800; margin-right: 8px; }
        .chat-input-area { padding: 1rem; border-top: 1px solid var(--border); display: flex; gap: 10px; }
        .chat-input-area input { flex: 1; background: #111; border: 1px solid #222; color: #fff; padding: 10px; border-radius: 12px; font-size: 0.85rem; outline: none; }
        .chat-input-area button { background: var(--primary); border: none; color: #fff; padding: 0 15px; border-radius: 12px; cursor: pointer; }
        .ad-box-sidebar { background: var(--card); border-radius: 20px; padding: 10px; border: 1px solid var(--border); text-align: center; }
        .ad-label { font-size: 0.5rem; color: #333; font-weight: bold; display: block; margin-bottom: 5px; }
        @media (max-width: 1024px) {
          .main-content { grid-template-columns: 1fr; overflow-y: auto; }
          .video-section { border-right: none; position: sticky; top: 0; z-index: 100; }
          .sidebar { min-height: 500px; padding-bottom: 2rem; }
          .stream-container { overflow-y: auto; }
        }
      `}</style>
    </div>
  );
}
