import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../src/lib/supabase';
import { profileService } from '../../src/services/profileService';
import Navbar from '../../src/components/Navbar';
import Chat from '../../src/components/Chat';
import VideoPlayer from '../../src/components/VideoPlayer';
import Modal from '../../src/components/Modal';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  
  const [streamer, setStreamer] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  // Estados para donaciones
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState(10);
  const [isDonating, setIsDonating] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });

  useEffect(() => {
    if (router.isReady && username) {
      fetchStreamerData();
    }
  }, [router.isReady, username]);

  const fetchStreamerData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: myP } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setCurrentUser(myP);
      }

      const { data: p } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (!p) return setLoading(false);
      setStreamer(p);

      const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).single();
      setStreamInfo(s);

      if (s) {
        const { data: h } = await supabase.from('messages').select('*').eq('stream_id', s.id).order('created_at', { ascending: true }).limit(50);
        if (h) setMessages(h.map(m => ({ id: m.id, user: m.username, text: m.content, mod: m.username === username })));

        const channel = supabase.channel(`chat-${s.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `stream_id=eq.${s.id}` }, (payload) => {
          setMessages(prev => [...prev, { id: payload.new.id, user: payload.new.username, text: payload.new.content, mod: payload.new.username === username }]);
        }).subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSendMessage = async (text) => {
    if (!currentUser || !streamInfo) return;
    await supabase.from('messages').insert([{ stream_id: streamInfo.id, user_id: currentUser.id, username: currentUser.username, content: text }]);
  };

  const handleDonate = async () => {
    if (!currentUser) return alert("Inicia sesión para donar");
    setIsDonating(true);
    try {
      await profileService.sendDonation(username, donateAmount);
      setToast({ type: 'success', text: `¡Donaste ${donateAmount} Chill Flow! 🌊` });
      setShowDonate(false);
      // Refrescar mi saldo localmente
      setCurrentUser(prev => ({...prev, flow_balance: prev.flow_balance - donateAmount}));
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setIsDonating(false);
      setTimeout(() => setToast({ type: '', text: '' }), 4000);
    }
  };

  if (loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center font-black text-xs tracking-[5px]">CARGANDO SALA...</div>;

  if (!streamer) return <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-4"><h1 className="text-6xl font-black tracking-tighter">404</h1><button onClick={() => router.push('/')} className="bg-blue-600 px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest">Inicio</button></div>;

  return (
    <div className="h-screen w-full bg-[#0e0e10] text-white flex flex-col overflow-hidden">
      <Head><title>{streamInfo?.title || username} - ChillStream</title></Head>
      <Navbar isLive={true} />
      
      <main className="mt-[80px] flex-1 flex flex-row w-full h-[calc(100vh-80px)]">
        
        <section className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="w-full aspect-video bg-black relative shadow-2xl">
            <VideoPlayer streamerName={username} isLive={true} />
          </div>
          
          <div className="p-8 pb-32">
            <div className="flex justify-between items-start gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 shadow-xl">
                  <img src={streamer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{streamInfo?.title || 'Mi directo'}</h1>
                  <p className="text-blue-400 font-bold text-sm">@{username} • <span className="text-zinc-500 uppercase text-xs tracking-widest">{streamInfo?.category}</span></p>
                </div>
              </div>
              <button 
                onClick={() => setShowDonate(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-blue-500/20 hover:scale-[1.05] active:scale-95 transition-all"
              >
                APOYAR CON FLOW 🌊
              </button>
            </div>
            
            {streamer.bio && <p className="mt-8 text-zinc-400 text-sm leading-relaxed max-w-3xl bg-white/[0.02] p-8 rounded-3xl border border-white/5 font-medium">{streamer.bio}</p>}
            
            {/* LINKS EXTERNOS */}
            <div className="flex gap-4 mt-8">
              {streamer.paypal_url && <a href={streamer.paypal_url} target="_blank" className="bg-white/5 px-6 py-3 rounded-xl text-[10px] font-black border border-white/5 hover:bg-blue-500 transition-all uppercase tracking-widest">PayPal</a>}
              {streamer.kofi_url && <a href={streamer.kofi_url} target="_blank" className="bg-white/5 px-6 py-3 rounded-xl text-[10px] font-black border border-white/5 hover:bg-orange-500 transition-all uppercase tracking-widest">Ko-fi</a>}
            </div>
          </div>
        </section>

        <aside className="hidden lg:block w-[400px] h-full shrink-0 border-l border-white/5">
          <Chat messages={messages} onSendMessage={handleSendMessage} />
        </aside>
      </main>

      {/* MODAL DE DONACIÓN */}
      <Modal isOpen={showDonate} onClose={() => setShowDonate(false)} title="Enviar Chill Flow 🌊">
        <div className="p-4 text-center">
          <p className="text-zinc-500 text-xs mb-8 uppercase font-black tracking-widest">¿Cuánto quieres donar a {username}?</p>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[10, 50, 100].map(amt => (
              <button 
                key={amt} 
                onClick={() => setDonateAmount(amt)}
                className={`p-6 rounded-2xl border-2 font-black transition-all ${donateAmount === amt ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 text-zinc-500'}`}
              >
                {amt}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-zinc-600 font-bold mb-6 uppercase tracking-[3px]">Tu saldo actual: ${currentUser?.flow_balance?.toFixed(2) || '0.00'}</p>
          <button 
            onClick={handleDonate}
            disabled={isDonating || !currentUser}
            className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20"
          >
            {isDonating ? 'PROCESANDO...' : `CONFIRMAR DONACIÓN DE ${donateAmount} CF`}
          </button>
        </div>
      </Modal>

      {/* TOAST DE FEEDBACK */}
      <AnimatePresence>
        {toast.text && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`fixed bottom-10 left-1/2 -translate-x-1/2 p-6 rounded-[30px] font-black text-xs uppercase tracking-[3px] shadow-2xl z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body { margin: 0; padding: 0; overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
