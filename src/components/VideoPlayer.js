import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ streamerName }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isOffline, setIsOffline] = useState(false);

  const PENTIUM_IP = '192.168.100.24';
  const videoUrl = `http://${PENTIUM_IP}/hls/${streamerName}/index.m3u8`;

  useEffect(() => {
    // 1. Reiniciar estado al cambiar de streamer
    setIsOffline(false);

    // 2. Asegurarse de que el elemento existe y no hay un player activo
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: videoUrl,
          type: 'application/x-mpegURL'
        }]
      }, () => {
        console.log('Video.js Player listo');
      });

      // MANEJO DE ERRORES (OFFLINE)
      player.on('error', () => {
        const error = player.error();
        if (error.code === 4 || error.code === 2) {
          setIsOffline(true);
        }
      });
    }

    // 3. LIMPIEZA CRÍTICA (Evita el error removeChild)
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamerName, videoUrl]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
      
      {/* EL REPRODUCTOR (Se oculta si está offline pero no se elimina del DOM para no romper React) */}
      <div data-vjs-player className={isOffline ? 'hidden' : 'block w-full h-full'}>
        <video 
          ref={videoRef} 
          className="video-js vjs-big-play-centered vjs-theme-city"
          playsInline
        />
      </div>

      {/* PANTALLA OFFLINE (Se muestra encima) */}
      {isOffline && (
        <div className="absolute inset-0 z-10 bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-10">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent animate-pulse"></div>
          <div className="relative z-20 space-y-6">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 mx-auto shadow-2xl">
              <span className="text-3xl">😴</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-zinc-400 text-xs font-black tracking-[6px] uppercase">Canal Fuera de Línea</h3>
              <p className="text-zinc-600 text-sm font-medium">@{streamerName} no está transmitiendo.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Reintentar Conexión 🔄
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .video-js { background-color: #000 !important; width: 100% !important; height: 100% !important; }
        .vjs-theme-city .vjs-control-bar { background: rgba(5, 5, 5, 0.8) !important; backdrop-filter: blur(20px); height: 60px; }
        .vjs-big-play-button { background-color: rgba(37, 99, 235, 0.5) !important; border-radius: 20px !important; border: none !important; backdrop-filter: blur(10px); }
      `}</style>
    </div>
  );
}
