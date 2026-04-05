import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Navbar({ showActions = false, isLive = false }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('role, username')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[80px] z-50 px-[5%] flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-2xl">
      <Link href="/">
        <div className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2">
          🎮 <span className="text-white">Chill</span><span className="text-blue-500">Stream</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-6">
        {isLive && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-red-500 tracking-widest uppercase">EN VIVO</span>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest" onClick={() => router.push('/tienda')}>
                🛍️ Marketplace
              </button>
              <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors" onClick={() => router.push('/empezar')}>
                🚀 Quiero ser Streamer
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl text-xs font-black text-white transition-all active:scale-95" onClick={() => router.push('/login')}>
                Entrar
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/tienda')} className="hidden md:block text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                🛍️ Tienda
              </button>
              {profile?.role === 'admin' && (
                <button onClick={() => router.push('/admin')} className="hidden md:block bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest text-blue-400 transition-all uppercase">
                  Panel Admin 🛠️
                </button>
              )}

              {/* PERFIL CLICABLE */}
              <Link href="/dashboard">
                <div className="flex items-center gap-3 pr-4 border-r border-white/10 cursor-pointer group">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg group-hover:scale-105 transition-transform">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Mi Perfil</p>
                    <p className="text-xs font-bold text-zinc-200">{profile?.username || user.email?.split('@')[0]}</p>
                  </div>
                </div>
              </Link>

              <button onClick={handleLogout} className="text-[10px] font-black text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-widest">
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
