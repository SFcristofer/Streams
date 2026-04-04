import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from '../src/components/Navbar';
import StreamCard from '../src/components/StreamCard';
import Modal from '../src/components/Modal';
import Footer from '../src/components/Footer';
import HeroSection from '../src/components/HeroSection';
import Card from '../src/components/Card';
import { supabase } from '../src/lib/supabase';

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [activeStreamers, setActiveStreamers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreamers();
  }, []);

  const fetchStreamers = async () => {
    setLoading(true);
    try {
      // Consultar streamers reales de la base de datos
      const { data, error } = await supabase
        .from('profiles')
        .select('username, role, avatar_url')
        .eq('role', 'streamer')
        .limit(6);

      if (error) throw error;
      
      // Mapear los datos para el componente StreamCard
      const formatted = data.map((s, index) => ({
        id: index,
        name: s.username,
        viewers: Math.floor(Math.random() * 500) + 50, // Simulado por ahora
        title: `Directo de ${s.username}`,
        thumb: s.avatar_url || `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80`
      }));

      setActiveStreamers(formatted);
    } catch (err) {
      console.error("Error al cargar streamers:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToStream = (name) => {
    if (name) window.location.href = `/stream/${name.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <Head>
        <title>ChillStream | El Futuro del Streaming Privado</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <Navbar showActions={true} onLoginClick={() => window.location.href = '/login'} />

      <HeroSection 
        onMainAction={() => setShowAuth(true)}
        onSecondaryAction={() => window.location.href = '/login'}
      />

      <main className="max-w-[1400px] mx-auto px-6 py-20">
        
        {/* GRILLA DE STREAMS REALES */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tight uppercase">
              {activeStreamers.length > 0 ? '🔴 STREAMS EN VIVO' : '⌛ ESPERANDO STREAMERS'}
            </h2>
            {activeStreamers.length > 0 && (
              <span className="bg-red-500 text-[10px] font-black px-2 py-1 rounded-md animate-pulse">REALTIME</span>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-white/5 rounded-[28px] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeStreamers.length > 0 ? (
                activeStreamers.map(stream => (
                  <StreamCard key={stream.name} stream={stream} onClick={() => goToStream(stream.name)} />
                ))
              ) : (
                <div className="col-span-full p-20 text-center border border-white/5 rounded-[40px] bg-white/[0.01]">
                  <p className="text-zinc-500 font-bold tracking-widest uppercase">No hay canales activos en este momento.</p>
                  <button onClick={() => window.location.href = '/login'} className="mt-6 text-blue-500 font-black text-xs underline underline-offset-8">¡SÉ EL PRIMERO EN TRANSMITIR!</button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECCIÓN DE POR QUÉ ELEGIRNOS (ESTILO BENTO) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Red Pentium ⚡" 
            description="Tus streams corren en nuestra propia infraestructura local, sin intermediarios ni censura."
            className="md:col-span-2"
          />
          <Card 
            title="Baja Latencia 💎" 
            description="Fragmentos de 2 segundos para una interacción real con tu audiencia."
          />
          <Card 
            title="Privacidad 🛡️" 
            description="Tus datos y tus llaves de transmisión están protegidos con encriptación de grado militar."
          />
          <Card 
            title="Monetización 💰" 
            description="Sin comisiones. El apoyo de tus fans va directo a tu cuenta a través de nuestro sistema integrado."
            className="md:col-span-2"
          />
        </section>
      </main>

      <Modal isOpen={showAuth} onClose={() => setShowAuth(false)} title="Explorar Sala">
        <div className="space-y-6">
          <p className="text-zinc-500">Ingresa el nombre del streamer que quieres ver:</p>
          <input 
            type="text" 
            placeholder="Ej: cristofer" 
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && goToStream(roomName)}
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all text-center font-bold"
          />
          <button 
            onClick={() => goToStream(roomName)}
            className="w-full bg-blue-600 p-5 rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95"
          >
            ENTRAR A LA SALA
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
