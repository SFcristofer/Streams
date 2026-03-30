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

  // Inyectar el anuncio lateral pasivo (300x250) de forma automática
  useEffect(() => {
    if (username) {
      const script = document.createElement('script');
      script.src = 'https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
    }
  }, [username]);

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

      {/* Social Bar / Pop Push - Pasivo en la esquina */}
      <Script src="https://pl29013554.profitablecpmratenetwork.com/f9/c5/7d/f9c57dddbe4f098a2de17b9a18ca6947.js" strategy="lazyOnload" />

      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>🎮 Chill<span>Stream</span></div>
        <button className="btn-exit" onClick={() => window.location.href = '/'}>Salir</button>
      </nav>

      <main className="main-content">
        <section className="video-section">
          <div className="video-wrapper">
            {adPlaying && (
              <div className="mini-ad-box">
                <div className="ad-header"><span>SPONSOR</span><span>{adTimeLeft}s</span></div>
                <div className="ad-body">Cargando stream...</div>
              </div>
            )}
            <div data-vjs-player>
              <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-city" playsInline muted />
            </div>
          </div>

          <div className="details-card">
            <div className="text-info">
              <h2>🔴 En Vivo: {username}</h2>
              <p>Calidad: HD | Servidor: Cloudflare Pro</p>
            </div>
            
            {/* BANNER PASIVO HORIZONTAL (320x50) BAJO VIDEO */}
            <div className="passive-horizontal-ad">
              <Script id="banner-horizontal-options" strategy="afterInteractive">
                {`atOptions = { 'key' : '1da0e70a20c4240ea69ce193167c37f5', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`}
              </Script>
              <Script src="https://www.highperformanceformat.com/1da0e70a20c4240ea69ce193167c37f5/invoke.js" strategy="afterInteractive" />
            </div>
          </div>
        </section>

        <aside className="sidebar">
          {/* BANNER PASIVO VERTICAL (300x250) ENCIMA DEL CHAT */}
          <div className="passive-sidebar-ad">
            <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
          </div>

          <div className="chat-dummy">
            <div className="chat-header">CHAT EN VIVO</div>
            <div className="chat-msg">Bienvenido a la sala de {username}</div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        :root { --primary: #0070f3; --bg: #050505; --card: #111; --text: #fff; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui; overflow: hidden; }
        .stream-container { height: 100vh; display: flex; flex-direction: column; }
        .navbar { height: 50px; background: #000; display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; border-bottom: 1px solid #222; }
        .logo { font-weight: bold; cursor: pointer; color: var(--primary); }
        .main-content { flex: 1; display: grid; grid-template-columns: 1fr 320px; gap: 10px; padding: 10px; overflow: hidden; }
        .video-section { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
        .video-wrapper { position: relative; background: #000; border-radius: 12px; overflow: hidden; }
        .mini-ad-box { position: absolute; top: 15px; right: 15px; width: 180px; background: #000; border: 1px solid var(--primary); border-radius: 8px; z-index: 100; }
        .ad-header { padding: 5px 10px; background: var(--primary); display: flex; justify-content: space-between; font-size: 0.6rem; font-weight: bold; }
        .ad-body { padding: 10px; text-align: center; font-size: 0.7rem; color: #555; }
        
        .details-card { background: var(--card); padding: 1.2rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #222; }
        .details-card h2 { margin: 0; font-size: 1.1rem; }
        .details-card p { margin: 5px 0 0 0; font-size: 0.7rem; color: #444; }
        
        .passive-horizontal-ad { background: #000; border-radius: 8px; padding: 5px; min-width: 320px; min-height: 50px; display: flex; align-items: center; justify-content: center; }

        .sidebar { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .passive-sidebar-ad { background: var(--card); border-radius: 12px; padding: 10px; border: 1px solid #222; min-height: 250px; text-align: center; }
        .chat-dummy { flex: 1; background: var(--card); border-radius: 12px; border: 1px solid #222; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 10px; background: #111; text-align: center; font-size: 0.6rem; color: #444; font-weight: bold; letter-spacing: 1px; border-bottom: 1px solid #222; }
        .chat-msg { padding: 10px; font-size: 0.75rem; color: #666; font-style: italic; }
      `}</style>
    </div>
  );
}
