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
    if (router.isReady && username) {
      fetchStreamerData();
    }
  }, [router.isReady, username]);

  const fetchStreamerData = async () => {
    setLoading(true);
    try {
      // 1. Sesión de usuario
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: myP } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setCurrentUser(myP);
      }

      // 2. Perfil del streamer
      const { data: p } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (!p) return setLoading(false);
      setStreamer(p);

      // 3. Info del stream
      const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).single();
      setStreamInfo(s);

      if (s) {
        // 4. Historial
        const { data: h } = await supabase.from('messages').select('*').eq('stream_id', s.id).order('created_at', { ascending: true }).limit(50);
        if (h) setMessages(h.map(m => ({ id: m.id, user: m.username, text: m.content, mod: m.username === username })));

        // 5. Realtime
        const channel = supabase.channel(`chat-${s.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `stream_id=eq.${s.id}` }, (payload) => {
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
    await supabase.from('messages').insert([{ 
      stream_id: streamInfo.id, 
      user_id: currentUser.id, 
      username: currentUser.username, 
      content: text 
    }]);
  };

  if (loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center font-bold">CARGANDO...</div>;

  if (!streamer) return <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-4"><h1>404 - Canal no encontrado</h1><button onClick={() => router.push('/')}>Inicio</button></div>;

  return (
    <div className="h-screen w-full bg-[#0e0e10] text-white flex flex-col overflow-hidden">
      <Head><title>{username} - ChillStream</title></Head>
      <Navbar isLive={true} />
      <main className="mt-[80px] flex-1 flex flex-row w-full h-[calc(100vh-80px)]">
        <section className="flex-1 overflow-y-auto">
          <VideoPlayer streamerName={username} isLive={true} />
          <div className="p-8">
            <h1 className="text-2xl font-black">{streamInfo?.title || 'Directo'}</h1>
            <p className="text-blue-400">@{username}</p>
            {streamer.bio && <p className="mt-4 text-zinc-400">{streamer.bio}</p>}
          </div>
        </section>
        <aside className="w-[400px] h-full border-l border-white/5">
          <Chat messages={messages} onSendMessage={handleSendMessage} />
        </aside>
      </main>
    </div>
  );
}
