import { motion } from "framer-motion";
import ShimmerButton from "./ShimmerButton";

export default function HeroSection({ onMainAction, onSecondaryAction }) {
  return (
    <header className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-32 px-5">
      {/* Fondo de Gradientes Dinámicos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />
        <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <span className="inline-block px-4 py-1 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-black tracking-widest text-blue-400">
          PLATAFORMA ELITE • 2026
        </span>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8">
          Streaming <br />
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Sin Censura
          </span>
        </h1>

        <p className="text-zinc-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          La red exclusiva donde el contenido es real. <br />
          <span className="text-zinc-400">Sin límites, sin ataduras, solo libertad pura.</span>
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <ShimmerButton onClick={onMainAction}>
            Ver Canales en Vivo
          </ShimmerButton>
          
          <button 
            onClick={onSecondaryAction}
            className="px-8 py-4 font-bold text-white rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
          >
            Emitir en Directo 🎥
          </button>
        </div>
      </motion.div>
    </header>
  );
}
