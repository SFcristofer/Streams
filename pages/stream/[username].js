import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  const [streamerData, setStreamerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncTick, setSyncTick] = useState(0);

  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || '3fcf4f1e361dfa9d68cf57bdba0b7bcf';

  useEffect(() => {
    if (username) {
      fetch(`/api/get-streamer?username=${username}`)
        .then(res => res.json())
        .then(data => {
          if (data.cloudflare_uid) setStreamerData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [username]);

  useEffect(() => {
    const internalSync = setInterval(() => {
      setSyncTick(prev => prev + 1);
    }, 45000);
    return () => clearInterval(internalSync);
  }, []);

  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: `¡Bienvenido a la sala de ${username}!`, mod: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Usuario', text: newMessage, mod: false }]);
    setNewMessage('');
  };

  const recommendedStreams = [
    { id: 1, name: 'Cristian', viewers: '1.2k', title: 'Chill & Games 🎮', thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Elite_Gamer', viewers: '850', title: 'Noche de Terror 👻', thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Relax_Mode', viewers: '2.4k', title: 'Solo Música para Estudiar 🎧', thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  ];

  if (loading) return <div className="loading">Conectando con la base de datos...</div>;

  return (
    <div className="stream-container">
      <Head><title>{`${username || 'Live'} | ChillStream`}</title></Head>

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <div className="live-pill">LIVE</div>
      </nav>

      <main className="main-content">
        <section className="video-section">
          <div className="video-wrapper">
            {streamerData ? (
              <iframe src={`https://customer-${accountId}.cloudflarestream.com/${streamerData.cloudflare_uid}/iframe?preload=true&autoplay=true&muted=true`} style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} allowFullScreen={true}></iframe>
            ) : (
              <div className="no-stream"><h3>SALA NO ENCONTRADA</h3><p>Este streamer aún no ha generado su canal.</p></div>
            )}
          </div>
          <div className="details-bar">
            <div className="streamer-info">
              <div className="avatar">{username?.charAt(0).toUpperCase()}</div>
              <div className="meta"><h3>{username}</h3><p>Streaming en directo • 1080p Ultra</p></div>
            </div>
            <button className="btn-donate">DONAR 💎</button>
          </div>
          <div className="extra-content">
            <div className="section-header"><h3>Streams Recomendados</h3><div className="line"></div></div>
            <div className="recommended-grid">
              {recommendedStreams.map(stream => (
                <div key={stream.id} className="rec-card" onClick={() => window.location.href = `/stream/${stream.name.toLowerCase()}`}>
                  <img src={stream.thumb} alt={stream.title} /><div className="rec-info"><h4>{stream.title}</h4><p>{stream.name} • {stream.viewers} viewers</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <div className="module-wrapper">
            <iframe 
              key={`u-${syncTick}`} 
              src={`/api/sys-module?v=${syncTick}`} 
              width="100%" 
              height="250" 
              style={{ border: 'none' }} 
              sandbox="allow-scripts allow-forms allow-same-origin" 
            />
          </div>
          <div className="chat-box">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className="msg"><span className={msg.mod ? 'mod' : 'user-name'}>{msg.user}:</span> {msg.text}</div>
              ))}
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
              <input type="text" placeholder="Escribe un mensaje..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button type="submit">🚀</button>
            </form>
          </div>
          <div className="module-wrapper">
            <iframe 
              key={`l-${syncTick}`} 
              src={`/api/provider?key=2a3357726d5ea2f9e1aad0f54a5ca4db&v=${syncTick}`} 
              width="100%" 
              height="250" 
              style={{ border: 'none', borderRadius: '15px' }} 
              sandbox="allow-scripts allow-forms allow-same-origin" 
            />
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #0a0a0a; --text: #fff; --border: rgba(255,255,255,0.08); }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 60px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; border-bottom: 1px solid var(--border); }
        .logo { font-weight: 900; color: var(--primary); cursor: pointer; }
        .live-pill { background: #ff4d4d; color: #fff; font-size: 0.6rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; }
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 350px; height: calc(100vh - 60px); }
        .video-section { display: flex; flex-direction: column; background: #000; overflow-y: auto; height: 100%; }
        .video-wrapper { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
        .no-stream { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #333; }
        .details-bar { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; background: #050505; border-bottom: 1px solid var(--border); }
        .extra-content { padding: 2rem; background: #050505; }
        .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 1.5rem; }
        .section-header h3 { font-size: 1.2rem; white-space: nowrap; margin: 0; color: #555; }
        .section-header .line { height: 1px; background: var(--border); flex: 1; }
        .recommended-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
        .rec-card { background: #0a0a0a; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; transition: 0.3s; }
        .rec-card:hover { border-color: var(--primary); transform: translateY(-5px); }
        .rec-card img { width: 100%; height: 140px; object-fit: cover; }
        .rec-info { padding: 12px; }
        .rec-info h4 { margin: 0; font-size: 0.9rem; }
        .rec-info p { margin: 5px 0 0 0; font-size: 0.75rem; color: #555; }

        .streamer-info { display: flex; align-items: center; gap: 15px; }
        .avatar { width: 45px; height: 45px; background: var(--primary); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .sidebar { background: #080808; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; height: 100%; overflow-y: auto; }
        .module-wrapper { background: var(--card); border-radius: 20px; padding: 10px; border: 1px solid var(--border); text-align: center; }
        .chat-box { flex: 1; min-height: 400px; background: var(--card); border-radius: 20px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 15px; background: #111; text-align: center; font-size: 0.7rem; color: #444; font-weight: 900; border-bottom: 1px solid var(--border); }
        .chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; }
        .msg { line-height: 1.4; }
        .mod { color: var(--primary); font-weight: bold; margin-right: 5px; }
        .user-name { color: #888; font-weight: bold; margin-right: 5px; }
        .chat-input { padding: 10px; background: #0a0a0a; border-top: 1px solid var(--border); display: flex; gap: 8px; }
        .chat-input input { flex: 1; background: #111; border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; color: #fff; outline: none; }
        .chat-input button { background: var(--primary); border: none; color: #fff; padding: 0 12px; border-radius: 8px; cursor: pointer; }
        .btn-donate { background: linear-gradient(45deg, #ffd700, #ffae00); color: #000; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: var(--primary); font-weight: bold; }
        @media (max-width: 1024px) {
          .main-content { grid-template-columns: 1fr; overflow-y: auto; }
          .stream-container { overflow-y: auto; }
        }
      `}</style>
    </div>
  );
}
