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
    if (!router.isReady) return;
    if (username) {
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

      const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (!profile) {
        setLoading(false);
        return;
      }
      setStreamer(profile);

      const { data: sInfo } = await supabase.from('streams').select('*').eq('streamer_id', profile.id).single();
      setStreamInfo(sInfo);

      if (sInfo) {
        // Cargar historial
        const { data: history } = await supabase.from('messages').select('*').eq('stream_id', sInfo.id).order('created_at', { ascending: true }).limit(50);
        if (history) setMessages(history.map(m => ({ id: m.id, user: m.username, text: m.content, mod: m.username === username })));

        // Realtime
        const channel = supabase.channel(`chat-${sInfo.id}`).on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `stream_id=eq.${sInfo.id}` 
        }, (payload) => {
          setMessages(prev => [...prev, { 
            id: payload.new.id, 
            user: payload.new.username, 
            text: payload.new.content, 
            mod: payload.new.username === username 
          }]);
        }).subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    } catch (err) {
      console.error("Error en sala:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!currentUser || !streamInfo) return;
    try {
      await supabase.from('messages').insert([{ 
        stream_id: streamInfo.id, 
        user_id: currentUser.id, 
        username: currentUser.username, 
        content: text 
      }]);
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  const handleDonate = async () => {
    if (!currentUser) return alert("Inicia sesión para donar");
    setIsDonating(true);
    try {
      await profileService.sendDonation(username, donateAmount);
      setToast({ type: 'success', text: `¡Donaste ${donateAmount} CF! 🌊` });
      setShowDonate(false);
      setCurrentUser(prev => ({...prev, flow_balance: prev.flow_balance - donateAmount}));
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    } finally {
      setIsDonating(false);
      setTimeout(() => setToast({ type: '', text: '' }), 4000);
    }
  };

  if (!router.isReady || loading) return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center font-black text-xs tracking-[5px] animate-pulse">
      CONECTANDO...
    </div>
  );

  if (!streamer) return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-black">404</h1>
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Canal inexistente</p>
      <button onClick={() => router.push('/')} className="bg-blue-600 px-8 py-3 rounded-xl font-bold uppercase text-[10px]">Inicio</button>
    </div>
  );

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
                  <h1 className="text-2xl font-black">{streamInfo?.title || 'Live Stream'}</h1>
                  <p className="text-blue-400 font-bold text-sm">@{username} • <span className="text-zinc-500 uppercase text-xs tracking-widest">{streamInfo?.category}</span></p>
                </div>
              </div>
              <button onClick={() => setShowDonate(true)} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:scale-[1.05] active:scale-95 transition-all">
                APOYAR 🌊
              </button>
            </div>
            {streamer.bio && <p className="mt-8 text-zinc-400 text-sm leading-relaxed max-w-3xl bg-white/[0.02] p-8 rounded-3xl border border-white/5">{streamer.bio}</p>}
          </div>
        </section>

        <aside className="hidden lg:block w-[400px] h-full shrink-0 border-l border-white/5 bg-[#0e0e10]">
          <Chat messages={messages} onSendMessage={handleSendMessage} />
        </aside>
      </main>

      <Modal isOpen={showDonate} onClose={() => setShowDonate(false)} title="Donar Chill Flow">
        <div className="p-4 text-center">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[10, 50, 100].map(amt => (
              <button key={amt} onClick={() => setDonateAmount(amt)} className={`p-6 rounded-2xl border-2 font-black transition-all ${donateAmount === amt ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 text-zinc-500'}`}>{amt}</button>
            ))}
          </div>
          <button onClick={handleDonate} disabled={isDonating} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xs uppercase shadow-xl">{isDonating ? '...' : `Donar ${donateAmount} CF`}</button>
        </div>
      </Modal>

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
