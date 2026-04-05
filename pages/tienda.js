import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import Card from '../src/components/Card';

export default function TiendaProximamente() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-hidden">
      <Head>
        <title>Marketplace | ChillStream</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-32">
        
        {/* EFECTOS DE FONDO NEÓN */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[4px] mb-8">
              Fase de Desarrollo: 0.8.2
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              EL MARKETPLACE <br/> ESTÁ <span className="text-blue-600">LLEGANDO</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
              Pronto podrás canjear tus <strong>Chill Points</strong> por tarjetas de regalo, hardware gaming y experiencias exclusivas directamente con tus streamers favoritos.
            </p>
          </motion.div>

          {/* VISTA PREVIA DE CATEGORÍAS (BLURRED) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 opacity-40 grayscale blur-[2px] pointer-events-none select-none">
            <Card title="Tarjetas de Regalo" description="Amazon, Steam, Netflix y más.">
              <div className="h-24 bg-white/5 rounded-2xl mt-4"></div>
            </Card>
            <Card title="Gaming Gear" description="Periféricos Pro para tu setup.">
              <div className="h-24 bg-white/5 rounded-2xl mt-4"></div>
            </Card>
            <Card title="Merch de Creador" description="Ropa y accesorios exclusivos.">
              <div className="h-24 bg-white/5 rounded-2xl mt-4"></div>
            </Card>
          </div>

          {/* MENSAJE DE ESPERA */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-3xl"
          >
            <h3 className="text-xl font-black mb-4 uppercase tracking-tight">¿Eres Streamer? 🎥</h3>
            <p className="text-zinc-500 text-sm mb-8">Estamos preparando las herramientas para que puedas subir tus propios productos digitales y físicos.</p>
            <button className="px-10 py-4 bg-white text-black font-black text-xs rounded-2xl hover:scale-105 transition-all">
              QUIERO SER DE LOS PRIMEROS
            </button>
          </motion.div>
        </div>

      </main>

      <Footer />

      <style jsx global>{`
        body { background: #050505; }
      `}</style>
    </div>
  );
}
