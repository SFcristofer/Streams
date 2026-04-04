import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../src/components/Navbar';
import Card from '../src/components/Card';
import Step from '../src/components/Step';
import Footer from '../src/components/Footer';
import { profileService } from '../src/services/profileService';
import { supabase } from '../src/lib/supabase';

export default function EmpezarStream() {
  const [profile, setProfile] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const PENTIUM_RTMP_URL = 'rtmp://192.168.100.24/ingest';

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const myProfile = await profileService.getMyProfile();
      if (!myProfile) {
        router.push('/login');
        return;
      }
      
      // Si no tiene username, mandarlo al dashboard para que elija uno (y se sincronice)
      if (!myProfile.username) {
        router.push('/dashboard');
        return;
      }

      setProfile(myProfile);

      // Obtener datos del stream desde Supabase
      const { data: stream } = await supabase
        .from('streams')
        .select('*')
        .eq('streamer_id', myProfile.id)
        .maybeSingle();
      
      if (stream) {
        setStreamData(stream);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <Head>
        <title>Centro de Transmisión | ChillStream</title>
      </Head>

      <Navbar />

      <main className="content">
        <div className="setup-grid">
          {/* LADO IZQUIERDO: CREDENCIALES DIRECTAS */}
          <Card 
            title="Tu Cabina de Streaming 🎥" 
            description="Aquí tienes todo lo que necesitas para salir al aire en la Red Pentium."
          >
            {streamData ? (
              <div className="credentials fade-in">
                <div className="info-badge">CANAL VERIFICADO Y ACTIVO</div>
                
                <div className="cred-field">
                  <label>SERVIDOR RTMP</label>
                  <div className="value-box">{PENTIUM_RTMP_URL}</div>
                </div>

                <div className="cred-field">
                  <label>TU CLAVE PRIVADA (SECRET)</label>
                  <div className="value-box secret">{streamData.stream_key}</div>
                </div>

                <div className="share-info">
                  <label>DIRECCIÓN DE TU SALA</label>
                  <div className="url-badge" onClick={() => window.location.href = `/stream/${profile.username}`}>
                    localhost:3001/stream/{profile.username}
                  </div>
                </div>

                <div className="warning-box">
                  <p>⚠️ <strong>Aviso de Seguridad:</strong> Tu clave es como tu contraseña. No la muestres en pantalla durante tus transmisiones.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-zinc-500 mb-6 font-bold uppercase tracking-widest">Sincronizando con Pentium Server...</p>
                <button onClick={() => window.location.reload()} className="bg-blue-600 px-8 py-4 rounded-xl font-black text-xs">REFRESCAR ESTADO</button>
              </div>
            )}
          </Card>

          {/* LADO DERECHO: GUÍA RÁPIDA */}
          <Card variant="side">
            <h3 className="side-title">Configuración en 1 Minuto</h3>
            <div className="steps-container">
              <Step number="1">Abre <strong>OBS Studio</strong> en tu PC.</Step>
              <Step number="2">Ve a <strong>Ajustes &gt; Emisión</strong>.</Step>
              <Step number="3">Tipo de Servicio: <strong>Personalizado</strong>.</Step>
              <Step number="4">Pega el <strong>Servidor</strong> y tu <strong>Clave</strong>.</Step>
              <Step number="5">¡Dale a <strong>Iniciar</strong> y el mundo te verá!</Step>
            </div>
            
            <div className="pro-tip">
              <p>💡 <strong>Pro Tip:</strong> Para mejor calidad, usa un bitrate de 4500kbps y encoder x264 en OBS.</p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        :root { --primary: #3b82f6; --bg: #050505; --text: #fff; }
        .page-wrapper { min-height: 100vh; background: var(--bg); color: var(--text); }
        .content { max-width: 1200px; margin: 0 auto; padding: 8rem 2rem; }
        .setup-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; }

        .info-badge { background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 8px 16px; border-radius: 10px; font-size: 10px; font-weight: 900; letter-spacing: 2px; display: inline-block; margin-bottom: 2rem; border: 1px solid rgba(34, 197, 94, 0.2); }

        .cred-field { margin-bottom: 2rem; }
        label { font-size: 0.65rem; font-weight: 900; color: #555; letter-spacing: 2px; display: block; margin-bottom: 12px; }
        .value-box { background: #000; padding: 20px; border-radius: 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; border: 1px solid #1a1a1a; color: var(--primary); }
        .value-box.secret { color: #ef4444; border-color: rgba(239, 68, 68, 0.1); }
        
        .url-badge { background: rgba(59, 130, 246, 0.1); color: var(--primary); padding: 18px; border-radius: 16px; font-weight: 900; border: 1px solid rgba(59, 130, 246, 0.2); text-align: center; cursor: pointer; transition: 0.3s; }
        .url-badge:hover { background: rgba(59, 130, 246, 0.2); transform: scale(1.02); }
        
        .warning-box { background: rgba(239, 68, 68, 0.05); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(239, 68, 68, 0.1); margin-top: 2rem; }
        .warning-box p { margin: 0; color: #666; font-size: 0.75rem; line-height: 1.6; }

        .pro-tip { background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 1rem; margin-top: 3rem; font-size: 0.8rem; color: #888; }

        @media (max-width: 900px) {
          .setup-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
