import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const chatEndRef = useRef(null);
  
  const [adPlaying, setAdPlaying] = useState(true);
  const [adTimeLeft, setAdTimeLeft] = useState(10);

  const streamUrl = `https://customer-ycfssauwomlccye1.cloudflarestream.com/20d23ae5b415df29bd6850b4de3ee2a1/manifest/video.m3u8`;

  useEffect(() => {
    if (adPlaying && adTimeLeft > 0) {
      const timer = setTimeout(() => setAdTimeLeft(adTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (adTimeLeft === 0) {
      setAdPlaying(false);
    }
  }, [adPlaying, adTimeLeft]);

  useEffect(() => {
    if (!adPlaying && username && videoRef.current && !playerRef.current) {
      initStream();
    }
  }, [adPlaying, username]);

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

      {/* SOLO BANNERS ESTÁTICOS. No Popunders. */}
      {!adPlaying && (
        <Script 
          src="https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js"
          strategy="afterInteractive"
        />
      )}

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <button className="btn-exit" onClick={() => window.location.href = '/'}>Salir</button>
      </nav>

      <main className="main-content">
        <section className="video-section">
          <div className="video-wrapper">
            {adPlaying && (
              <div className="mini-ad-box">
                <div className="ad-header"><span>PUBLICIDAD</span><span>{adTimeLeft}s</span></div>
                <div className="ad-body">
                  <div className="ad-spinner"></div>
                  <p>Cargando señal HD...</p>
                </div>
              </div>
            )}
            <div data-vjs-player>
              <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-city" playsInline muted />
            </div>
          </div>
          <div className="details-card">
            <h2>🔴 En Vivo: {username}</h2>
            <button className="btn-action donate">Apoyar 💎</button>
          </div>
        </section>

        <aside className="sidebar">
          <div className="chat-dummy">
            <div className="chat-header">CHAT</div>
            <div className="chat-msg">System: ¡Bienvenido!</div>
          </div>
          
          <div className="ad-sidebar-box">
            <span className="ad-label">Sponsor</span>
            <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid #222; }
        .logo { font-weight: bold; cursor: pointer; color: var(--primary); }
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 300px; gap: 10px; padding: 10px; }
        .video-section { display: flex; flex-direction: column; gap: 10px; }
        .video-wrapper { position: relative; background: #000; border-radius: 10px; overflow: hidden; }
        .mini-ad-box { position: absolute; top: 15px; right: 15px; width: 180px; background: #000; border: 1px solid var(--primary); border-radius: 8px; z-index: 100; }
        .ad-header { padding: 5px 10px; background: var(--primary); display: flex; justify-content: space-between; font-size: 0.6rem; font-weight: bold; }
        .ad-body { padding: 15px; text-align: center; font-size: 0.7rem; }
        .ad-spinner { width: 15px; height: 15px; border: 2px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 5px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .details-card { background: var(--card); padding: 1rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #222; }
        .sidebar { display: flex; flex-direction: column; gap: 10px; }
        .chat-dummy { flex: 1; background: var(--card); border-radius: 10px; border: 1px solid #222; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 8px; background: #111; text-align: center; font-size: 0.6rem; border-bottom: 1px solid #222; color: #444; }
        .chat-msg { padding: 10px; font-size: 0.75rem; color: #888; }
        .ad-sidebar-box { background: var(--card); border-radius: 10px; padding: 10px; border: 1px solid #222; text-align: center; min-height: 200px; }
        .ad-label { font-size: 0.5rem; color: #333; display: block; margin-bottom: 5px; }
        .btn-action.donate { background: #ffd700; color: #000; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
}
