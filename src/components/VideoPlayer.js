import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ streamerName, isLive = true }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // La URL de tu servidor Pentium que configuramos
  const PENTIUM_IP = '192.168.100.24';
  const videoUrl = `http://${PENTIUM_IP}/hls/${streamerName}/index.m3u8`;

  useEffect(() => {
    // Asegurarse de que video.js solo se inicialice una vez
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;
      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        liveui: true,
        sources: [{
          src: videoUrl,
          type: 'application/x-mpegURL'
        }]
      });

      player.on('error', () => {
        console.log('Stream no encontrado o servidor offline');
      });
    }
  }, [videoUrl]);

  // Destruir el reproductor al desmontar el componente
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  if (!isLive) {
    return (
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden rounded-3xl border border-white/5 group">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent animate-pulse" />
        <div className="relative z-10 text-center">
          <h3 className="text-zinc-500 text-xs font-black tracking-widest uppercase mb-2">CANAL OFFLINE</h3>
          <p className="text-zinc-600 text-sm">{streamerName} aún no ha iniciado transmisión.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5">
      <div data-vjs-player>
        <video 
          ref={videoRef} 
          className="video-js vjs-big-play-centered vjs-theme-city"
          playsInline
        />
      </div>
      
      {/* Estilos personalizados para el reproductor tipo Twitch */}
      <style jsx global>{`
        .vjs-theme-city .vjs-control-bar {
          background: rgba(5, 5, 5, 0.8) !important;
          backdrop-filter: blur(10px);
          height: 60px;
        }
        .vjs-big-play-button {
          background-color: rgba(37, 99, 235, 0.5) !important;
          border-radius: 20px !important;
          border: none !important;
          backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  );
}
