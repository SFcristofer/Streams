import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../src/lib/supabase';
import { profileService } from '../src/services/profileService';
import Navbar from '../src/components/Navbar';
import Card from '../src/components/Card';
import Footer from '../src/components/Footer';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stream, setStream] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [donations, setDonations] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // ESTADOS DE FORMULARIOS (TODOS LOS CAMPOS REUPERADOS)
  const [profileForm, setProfileForm] = useState({
    full_name: '', bio: '', avatar_url: '',
    twitter_url: '', instagram_url: '', discord_url: '',
    paypal_url: '', kofi_url: ''
  });

  const [channelForm, setChannelForm] = useState({ title: '', category: 'Charlando' });
  const [rewardForm, setRewardForm] = useState({ title: '', cost: 1000, icon: '🎁', type: 'challenge' });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInitialData();
    if (user?.id) {
      const channel = supabase.channel(`dashboard-realtime-${user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (p) => {
          setProfile(prev => ({ ...prev, ...p.new }));
        }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user?.id]);

  const loadInitialData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      try {
        const p = await profileService.getMyProfile();
        if (p) {
          setProfile(p);
          setProfileForm({
            full_name: p.full_name || '', bio: p.bio || '', avatar_url: p.avatar_url || '',
            twitter_url: p.twitter_url || '', instagram_url: p.instagram_url || '', discord_url: p.discord_url || '',
            paypal_url: p.paypal_url || '', kofi_url: p.kofi_url || ''
          });
          
          if (p.role === 'streamer') {
            const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).maybeSingle();
            if (s) {
              setStream(s);
              setChannelForm({ title: s.title || '', category: s.category || 'Charlando' });
            }
            const { data: donat } = await supabase.from('donations').select('*, sender:profiles!donations_sender_id_fkey(username)').eq('receiver_id', p.id).order('created_at', { ascending: false }).limit(5);
            setDonations(donat || []);
            const rwd = await profileService.getChannelRewards(p.id);
            setRewards(rwd || []);
            const redemp = await profileService.getPendingRedemptions();
            setRedemptions(redemp || []);
          }
        }
      } catch (err) { console.error(err); }
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').update(profileForm).eq('id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, ...profileForm }));
      showToast('success', '¡Ajustes de perfil guardados!');
    } catch (err) { showToast('error', err.message); }
    finally { setIsSaving(false); }
  };

  const handleSaveChannel = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateStreamInfo(stream.id, channelForm);
      setStream(prev => ({ ...prev, ...channelForm }));
      showToast('success', '¡Canal actualizado!');
    } catch (err) { showToast('error', err.message); }
    finally { setIsSaving(false); }
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newR = await profileService.addChannelReward(rewardForm);
      setRewards(prev => [...prev, newR]);
      setRewardForm({ title: '', cost: 1000, icon: '🎁', type: 'challenge' });
      showToast('success', '¡Premio añadido a la tienda!');
    } catch (err) { showToast('error', err.message); }
    finally { setIsSaving(false); }
  };

  const toggleTTS = async () => {
    const newVal = !profile.tts_enabled;
    setProfile(prev => ({ ...prev, tts_enabled: newVal }));
    const { error } = await supabase.from('profiles').update({ tts_enabled: newVal }).eq('id', user.id);
    if (error) setProfile(prev => ({ ...prev, tts_enabled: !newVal }));
    else showToast('success', newVal ? 'Voz Activada' : 'Voz Silenciada');
  };

  const showToast = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  if (loading) return <div className="h-screen w-full bg-black flex items-center justify-center font-black animate-pulse uppercase tracking-[5px]">CHILLSTREAM...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Head><title>Dashboard Pro | ChillStream</title></Head>
      <Navbar />

      <main className="pt-32 pb-20 px-[5%] max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-3xl relative overflow-hidden">
          <div className="w-24 h-24 rounded-[30px] overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800 flex items-center justify-center text-3xl font-black uppercase">
            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : profile?.username?.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{profile?.username}</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-[3px] uppercase mt-1">{profile?.role} • {user?.email}</p>
          </div>
          <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>WALLET</button>
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>AJUSTES</button>
            {profile?.role === 'streamer' && <button onClick={() => setActiveTab('channel')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'channel' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>CANAL</button>}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Flow Actual 💰">
                  <div className="mt-4 p-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[35px] shadow-2xl shadow-blue-600/20">
                    <h4 className="text-5xl font-black mb-2">${profile?.flow_balance?.toFixed(2)}</h4>
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Saldo Disponible</p>
                  </div>
                </Card>
                <Card title="Chill Points 🎮">
                  <div className="mt-4 p-8 bg-zinc-900 border border-white/5 rounded-[35px] shadow-2xl">
                    <h4 className="text-5xl font-black mb-2 text-zinc-300">{profile?.chill_points}</h4>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Engagement</p>
                  </div>
                </Card>
              </div>

              {profile?.role === 'streamer' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card title="Retos Pendientes 🎁">
                    <div className="mt-6 space-y-4">
                      {redemptions.length > 0 ? redemptions.map(r => (
                        <div key={r.id} className="flex justify-between items-center p-5 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                          <div><p className="text-sm font-black">{r.reward?.title}</p><p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">DE: @{r.sender?.username} {r.user_input && `- "${r.user_input}"`}</p></div>
                          <button onClick={() => profileService.completeRedemption(r.id).then(loadInitialData)} className="bg-blue-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase">Hecho</button>
                        </div>
                      )) : <p className="text-center py-10 text-zinc-600 text-xs font-bold uppercase border border-dashed border-white/5 rounded-3xl">Sin retos activos</p>}
                    </div>
                  </Card>
                  <Card title="Ingresos Recientes 🌊">
                    <div className="mt-6 space-y-4">
                      {donations.map(d => (
                        <div key={d.id} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl"><p className="text-sm font-black">@{d.sender?.username || 'Anónimo'}</p><p className="text-green-500 font-black text-lg">+ ${d.amount}</p></div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card title="Ajustes de Identidad" description="Personaliza tu presencia en la red.">
                <form onSubmit={handleSaveProfile} className="mt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Nombre Público</label>
                      <input type="text" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">URL del Avatar</label>
                      <input type="text" value={profileForm.avatar_url} onChange={e => setProfileForm({...profileForm, avatar_url: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Bio del Creador</label>
                    <textarea rows="3" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" />
                  </div>
                  
                  {/* REDES SOCIALES RECUPERADAS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={profileForm.twitter_url} onChange={e => setProfileForm({...profileForm, twitter_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="X (Twitter)" />
                    <input type="text" value={profileForm.instagram_url} onChange={e => setProfileForm({...profileForm, instagram_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Instagram" />
                    <input type="text" value={profileForm.discord_url} onChange={e => setProfileForm({...profileForm, discord_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Discord" />
                  </div>

                  {/* LINKS DE PAGO RECUPERADOS */}
                  <div className="bg-blue-600/5 p-8 rounded-[35px] border border-blue-600/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={profileForm.paypal_url} onChange={e => setProfileForm({...profileForm, paypal_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="PayPal.me link" />
                    <input type="text" value={profileForm.kofi_url} onChange={e => setProfileForm({...profileForm, kofi_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Ko-fi link" />
                  </div>

                  <button type="submit" disabled={isSaving} className="px-12 py-5 bg-blue-600 rounded-3xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 transition-all">GUARDAR CAMBIOS</button>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'channel' && (
            <motion.div key="channel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <Card title="Asistente de Voz 🎙️" description="Configuración del narrador para el stream.">
                <div className="mt-6 flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                  <p className="text-sm font-black uppercase tracking-widest">{profile?.tts_enabled ? 'Voz Activada ✅' : 'Voz Silenciada 🔇'}</p>
                  <button onClick={toggleTTS} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${profile?.tts_enabled ? 'bg-red-500/10 text-red-500' : 'bg-green-500 text-black'}`}>{profile?.tts_enabled ? 'Mute' : 'Activar'}</button>
                </div>
              </Card>
              <Card title="Ajustes de Transmisión">
                <form onSubmit={handleSaveChannel} className="mt-6 space-y-6">
                  <input type="text" value={channelForm.title} onChange={e => setChannelForm({...channelForm, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Título del stream..." />
                  <select value={channelForm.category} onChange={e => setChannelForm({...channelForm, category: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none"><option>Charlando</option><option>Gaming</option><option>Música</option><option>Tecnología</option></select>
                  <button type="submit" disabled={isSaving} className="bg-green-600 px-10 py-4 rounded-2xl font-black text-xs uppercase transition-all hover:bg-green-700">Actualizar Canal</button>
                </form>
              </Card>
              <Card title="Tienda de Recompensas 🎁">
                <form onSubmit={handleAddReward} className="mt-6 space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" required value={rewardForm.title} onChange={e => setRewardForm({...rewardForm, title: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-sm" placeholder="Título premio..." />
                    <input type="number" required value={rewardForm.cost} onChange={e => setRewardForm({...rewardForm, cost: parseInt(e.target.value)})} className="bg-black border border-white/10 p-4 rounded-2xl text-sm" placeholder="Coste CP" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={rewardForm.type} onChange={e => setRewardForm({...rewardForm, type: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-sm"><option value="challenge">Reto Físico</option><option value="tts">Voz (TTS)</option></select>
                    <input type="text" value={rewardForm.icon} onChange={e => setRewardForm({...rewardForm, icon: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-center" />
                  </div>
                  <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase">Añadir Premio</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map(r => (
                    <div key={r.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-4"><span className="text-2xl">{r.icon}</span><div><p className="text-sm font-black">{r.title}</p><p className={`text-[9px] font-black uppercase ${r.type === 'tts' ? 'text-blue-400' : 'text-zinc-500'}`}>{r.type === 'tts' ? '🎙️ Voz' : '🏁 Reto'}</p></div></div>
                      <button onClick={() => profileService.deleteChannelReward(r.id).then(loadInitialData)} className="opacity-0 group-hover:opacity-100 text-red-500 text-[10px] font-black uppercase">Borrar</button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {statusMsg.text && (
          <div className={`fixed bottom-10 right-10 p-6 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl z-50 ${statusMsg.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{statusMsg.text}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
