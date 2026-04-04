import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
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

  // ESTADOS DE ALERTAS
  const [activeAlert, setActiveAlert] = useState(null);
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState(10);
  const [isDonating, setIsDonating] = useState(false);

  // FUNCIÓN NARRADOR (TTS) - Solo habla si el streamer lo permite
  const speak = useCallback((msg) => {
    if (typeof window !== 'undefined' && window.speechSynthesis && streamer?.tts_enabled) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = 'es-MX';
      window.speechSynthesis.speak(u);
    }
  }, [streamer?.tts_enabled]);

  useEffect(() => {
    if (!router.isReady) return;
    if (username) loadAll();
  }, [router.isReady, username]);

  // MOTOR PUNTOS
  useEffect(() => {
    if (!currentUser?.id || !streamInfo) return;
    const interval = setInterval(async () => {
      const { data, error } = await supabase.from('profiles').update({ chill_points: (currentUser.chill_points || 0) + 10 }).eq('id', currentUser.id).select().single();
      if (!error && data) setCurrentUser(data);
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser?.id, !!streamInfo]);

  // SINCRONIZACIÓN TTS REALTIME
  useEffect(() => {
    if (!streamer?.id) return;
    const channel = supabase.channel(`tts-sync-${streamer.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${streamer.id}` }, (p) => {
        setStreamer(prev => ({ ...prev, tts_enabled: p.new.tts_enabled }));
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [streamer?.id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: myP } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setCurrentUser(myP);
      }

      const { data: p } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (!p) { setLoading(false); return; }
      setStreamer(p);

      const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).single();
      setStreamInfo(s);

      if (s) {
        const { data: h } = await supabase.from('messages').select('*').eq('stream_id', s.id).order('created_at', { ascending: true }).limit(50);
        if (h) setMessages(h.map(m => ({ id: m.id, user: m.username, text: m.content, mod: m.username === username })));

        const chan = supabase.channel(`events-${s.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `stream_id=eq.${s.id}` }, (py) => {
            setMessages(prev => [...prev, { id: py.new.id, user: py.new.username, text: py.new.content, mod: py.new.username === username }]);
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reward_redemptions', filter: `streamer_id=eq.${p.id}` }, async (py) => {
            const { data: rw } = await supabase.from('channel_rewards').select('*').eq('id', py.new.reward_id).single();
            const { data: us } = await supabase.from('profiles').select('username').eq('id', py.new.user_id).single();
            
            // EL NARRADOR SOLO HABLA SI ES TIPO TTS
            if (rw.type === 'tts') {
              speak(`${us.username} dice: ${py.new.user_input}`);
            }
            
            setActiveAlert({ type: 'RECOMPENSA', title: rw.title, user: us.username, icon: rw.icon, color: 'from-blue-600 to-cyan-500' });
            setTimeout(() => setActiveAlert(null), 6000);
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations', filter: `receiver_id=eq.${p.id}` }, async (py) => {
            const { data: snd } = await supabase.from('profiles').select('username').eq('id', py.new.sender_id).single();
            speak(`${snd?.username || 'Anónimo'} donó ${py.new.amount} Flow`);
            setActiveAlert({ type: 'DONACIÓN', title: `$${pay.new.amount} CF`, user: snd?.username || 'Anónimo', icon: '🌊', color: 'from-yellow-400 to-orange-500' });
            setTimeout(() => setActiveAlert(null), 6000);
          })
          .subscribe();
        return () => { supabase.removeChannel(chan); };
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (!router.isReady || loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center font-black animate-pulse uppercase tracking-[5px]">CHILLSTREAM...</div>;

  if (!streamer) return <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-4"><h1>404 - Canal no encontrado</h1><button onClick={() => router.push('/')} className="bg-blue-600 px-8 py-2 rounded-xl uppercase font-black text-xs">Volver</button></div>;

  return (
    <div className="h-screen w-full bg-[#0e0e10] text-white flex flex-col overflow-hidden">
      <Head><title>{username} - ChillStream</title></Head>
      <Navbar isLive={true} />
      
      <main className="mt-[80px] flex-1 flex flex-row w-full h-[calc(100vh-80px)]">
        <section className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="w-full aspect-video bg-black relative overflow-hidden shadow-2xl">
            <VideoPlayer streamerName={username} isLive={true} />
            <AnimatePresence>
              {activeAlert && (
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 50 }} exit={{ opacity: 0 }} className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                  <div className={`bg-gradient-to-r ${activeAlert.color} p-8 rounded-[30px] shadow-2xl flex items-center gap-6`}>
                    <span className="text-4xl animate-bounce">{activeAlert.icon}</span>
                    <div className="text-left"><p className="text-[10px] font-black uppercase opacity-50">{activeAlert.type}</p><h2 className="text-2xl font-black">@{activeAlert.user}</h2><p className="font-bold text-sm">{activeAlert.title}</p></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-8 pb-32">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600"><img src={streamer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} className="w-full h-full object-cover" /></div>
                <div><h1 className="text-2xl font-black">{streamInfo?.title || 'En Directo'}</h1><p className="text-blue-400 font-bold">@{username} • {streamInfo?.category}</p></div>
              </div>
              <div className="flex items-center gap-4">
                {streamer.tts_enabled ? <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Voz Activa 🎙️</span> : <span className="text-[10px] font-black text-zinc-500 bg-white/5 px-3 py-1 rounded-full">Voz Off 🔇</span>}
                <button onClick={() => setShowDonate(true)} className="bg-blue-600 px-8 py-4 rounded-xl font-black text-xs shadow-xl">APOYAR 🌊</button>
              </div>
            </div>
            {streamer.bio && <p className="mt-8 text-zinc-400 leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/5 max-w-4xl">{streamer.bio}</p>}
          </div>
        </section>
        <aside className="w-[400px] h-full border-l border-white/5">
          <Chat messages={messages} onSendMessage={(t) => supabase.from('messages').insert([{ stream_id: streamInfo.id, user_id: currentUser.id, username: currentUser.username, content: t }])} chillPoints={currentUser?.chill_points || 0} streamerId={streamer?.id} streamId={streamInfo?.id} />
        </aside>
      </main>

      <Modal isOpen={showDonate} onClose={() => setShowDonate(false)} title="Donar">
        <div className="p-4 text-center">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[10, 50, 100].map(a => (<button key={a} onClick={() => setDonateAmount(a)} className={`p-6 rounded-2xl border-2 ${donateAmount === a ? 'border-blue-500 bg-blue-500/10' : 'border-white/5'}`}>{a}</button>))}
          </div>
          <button onClick={async () => { try { await profileService.sendDonation(username, donateAmount); setShowDonate(false); } catch(e) { alert(e.message); } }} className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase text-xs">Confirmar Donación</button>
        </div>
      </Modal>
    </div>
  );
}
