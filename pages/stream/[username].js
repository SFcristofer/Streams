import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../src/lib/supabase';
import Navbar from '../../src/components/Navbar';
import Chat from '../../src/components/Chat';
import VideoPlayer from '../../src/components/VideoPlayer';

export default function StreamRoom() {
  const router = useRouter();
  const { username } = router.query;
  
  const [streamer, setStreamer] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);

  // FUNCIÓN NARRADOR TTS (Lectura Universal)
  const speak = useCallback((text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis && streamer?.tts_enabled) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-MX';
      window.speechSynthesis.speak(u);
    }
  }, [streamer?.tts_enabled]);

  useEffect(() => {
    if (router.isReady && username) loadAll();
  }, [router.isReady, username]);

  // SINCRONIZACIÓN REALTIME DEL PERFIL DEL STREAMER
  useEffect(() => {
    if (!streamer?.id) return;
    const channel = supabase.channel(`sync-${streamer.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${streamer.id}` }, (payload) => {
        setStreamer(prev => ({ ...prev, tts_enabled: payload.new.tts_enabled }));
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
      if (!p) return setLoading(false);
      setStreamer(p);

      const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).single();
      setStreamInfo(s);

      if (s) {
        // Historial de Chat
        const { data: h } = await supabase.from('messages').select('*').eq('stream_id', s.id).order('created_at', { ascending: true }).limit(50);
        if (h) setMessages(h.map(m => ({ id: m.id, user: m.username, text: m.content, mod: m.username === username })));

        // CANAL REALTIME (Chat con Voz Universal + Alertas)
        const channel = supabase.channel(`live-${s.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `stream_id=eq.${s.id}` }, (py) => {
            const msg = py.new;
            setMessages(prev => [...prev, { id: msg.id, user: msg.username, text: msg.content, mod: msg.username === username }]);
            
            // ¡MAGIA! Leer cada mensaje que llega si el TTS está activo
            if (msg.username !== 'SISTEMA') {
              speak(`${msg.username} dice: ${msg.content}`);
            }
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reward_redemptions', filter: `streamer_id=eq.${p.id}` }, async (py) => {
            const { data: rw } = await supabase.from('channel_rewards').select('*').eq('id', py.new.reward_id).single();
            const { data: us } = await supabase.from('profiles').select('username').eq('id', py.new.user_id).single();
            
            speak(`¡Evento! ${us.username} ha canjeado ${rw.title}`);
            setActiveAlert({ type: 'RECOMPENSA', title: rw.title, user: us.username, icon: rw.icon, color: 'from-blue-600 to-indigo-600' });
            setTimeout(() => setActiveAlert(null), 6000);
          })
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSendMessage = async (text) => {
    if (!currentUser || !streamInfo) return;
    await supabase.from('messages').insert([{ stream_id: streamInfo.id, user_id: currentUser.id, username: currentUser.username, content: text }]);
  };

  if (!router.isReady || loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center font-black animate-pulse">CHILLSTREAM...</div>;

  if (!streamer) return <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-4"><h1>404</h1><button onClick={() => router.push('/')}>Inicio</button></div>;

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
                    <span className="text-4xl">{activeAlert.icon}</span>
                    <div className="text-left"><p className="text-[10px] font-black uppercase opacity-50">{activeAlert.type}</p><h2 className="text-2xl font-black">@{activeAlert.user}</h2><p className="font-bold text-sm">{activeAlert.title}</p></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-8 pb-32">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 shadow-xl"><img src={streamer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} className="w-full h-full object-cover" /></div>
                <div><h1 className="text-2xl font-black">{streamInfo?.title || 'Live Stream'}</h1><p className="text-blue-400 font-bold">@{username}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${streamer.tts_enabled ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-zinc-500 bg-white/5 border border-white/10'}`}>
                  {streamer.tts_enabled ? 'Lectura Activa 🎙️' : 'Voz Off 🔇'}
                </span>
              </div>
            </div>
            {streamer.bio && <p className="mt-8 text-zinc-400 leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/5 max-w-4xl">{streamer.bio}</p>}
          </div>
        </section>
        <aside className="w-[400px] h-full border-l border-white/5">
          <Chat messages={messages} onSendMessage={handleSendMessage} chillPoints={currentUser?.chill_points || 0} streamerId={streamer?.id} streamId={streamInfo?.id} />
        </aside>
      </main>
    </div>
  );
}
