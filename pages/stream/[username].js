import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
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
        const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setCurrentUser(myProfile);
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
        const { data: history } = await supabase.from('messages').select('*').eq('stream_id', sInfo.id).order('created_at', { ascending: true }).limit(50);
        if (history) setMessages(history.map(m => ({ id: m.id, user: m.username, text: m.content, mod: m.username === username })));

        const channel = supabase.channel(`chat-${sInfo.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `stream_id=eq.${sInfo.id}` }, (payload) => {
          setMessages(prev => [...prev, { id: payload.new.id, user: payload.new.username, text: payload.new.content, mod: payload.new.username === username }]);
        }).subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!currentUser || !streamInfo) return;
    await supabase.from('messages').insert([{ stream_id: streamInfo.id, user_id: currentUser.id, username: currentUser.username, content: text }]);
  };

  if (loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center font-bold">CARGANDO SALA...</div>;

  if (!streamer) return <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-4"><h1 className="text-6xl font-black">404</h1><p>Canal de {username} no encontrado</p><button onClick={() => router.push('/')} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">Ir al Inicio</button></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar isLive={true} />
      <main className="mt-[80px] flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        <section className="flex-1 overflow-y-auto p-12 space-y-8">
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/5">
            <VideoPlayer streamerName={username} isLive={true} />
          </div>
          <div className="p-10 bg-white/5 rounded-[40px] border border-white/10">
            <h1 className="text-3xl font-black mb-2">{streamInfo?.title || 'Sin Título'}</h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black">{username?.charAt(0).toUpperCase()}</div>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">@{username} • {streamInfo?.category}</p>
            </div>
          </div>
        </section>
        <aside className="w-[450px] h-full border-l border-white/5">
          <Chat messages={messages} onSendMessage={handleSendMessage} />
        </aside>
      </main>
    </div>
  );
}
