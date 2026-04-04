import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/admin' },
    { label: 'Streamers', icon: '🎥', path: '/admin/streamers' },
    { label: 'Usuarios', icon: '👥', path: '/admin/users' },
    { label: 'Pagos/Stripe', icon: '💰', path: '/admin/payments' },
    { label: 'Configuración', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* SIDEBAR PREMIUM */}
      <aside className="w-[300px] flex-none bg-[#0a0a0a] border-r border-white/5 flex flex-col p-8 relative z-20">
        <div className="mb-12">
          <Link href="/">
            <div className="text-xl font-black tracking-tighter cursor-pointer">
              🎮 <span className="text-white">Chill</span><span className="text-blue-500">Admin</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`
                relative flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all group
                ${router.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
              `}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {router.pathname === item.path && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-full" />
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 text-red-500 text-xs font-black hover:bg-red-500 hover:text-white transition-all"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#050505] to-[#0a0a0a]">
        {/* HEADER SUPERIOR */}
        <header className="h-[80px] flex-none px-12 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl bg-black/20">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Buscar por ID, nombre o correo..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">🔍</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-black text-white">Admin Master</p>
              <p className="text-[10px] font-bold text-blue-500">ROOT ACCESS</p>
            </div>
            <div className="w-10 h-10 bg-zinc-800 rounded-xl border border-white/10"></div>
          </div>
        </header>
        
        {/* ÁREA DE SCROLL DE CONTENIDO */}
        <div className="flex-1 overflow-y-auto p-12 scroll-smooth scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
