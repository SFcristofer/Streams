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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Formulario de Perfil
  const [profileForm, setProfileForm] = useState({
    full_name: '', bio: '', avatar_url: '',
    twitter_url: '', instagram_url: '', discord_url: '',
    paypal_url: '', kofi_url: ''
  });

  // Formulario de Canal
  const [channelForm, setChannelForm] = useState({ title: '', category: 'Charlando' });
  
  // Formulario de Recompensas
  const [rewardForm, setRewardForm] = useState({ title: '', cost: 1000, icon: '🎁' });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      try {
        const p = await profileService.getMyProfile();
        if (p) {
          setProfile(p);
          setProfileForm({
            full_name: p.full_name || '', bio: p.bio || '',
            avatar_url: p.avatar_url || '', twitter_url: p.twitter_url || '',
            instagram_url: p.instagram_url || '', discord_url: p.discord_url || '',
            paypal_url: p.paypal_url || '', kofi_url: p.kofi_url || ''
          });

          if (p.role === 'streamer') {
            const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).maybeSingle();
            if (s) {
              setStream(s);
              setChannelForm({ title: s.title || '', category: s.category || 'Charlando' });
            }
            // Cargar Donaciones e Historial de Recompensas
            const { data: donat } = await supabase.from('donations').select('*, sender:profiles!donations_sender_id_fkey(username)').eq('receiver_id', p.id).order('created_at', { ascending: false }).limit(5);
            setDonations(donat || []);
            
            // Cargar Recompensas del canal
            const rwd = await profileService.getChannelRewards(p.id);
            setRewards(rwd || []);
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
      await profileService.updateFullProfile(profileForm);
      showToast('success', '¡Perfil actualizado!');
      loadAllData();
    } catch (err) { showToast('error', err.message); }
    finally { setIsSaving(false); }
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.addChannelReward(rewardForm);
      showToast('success', '¡Recompensa añadida!');
      setRewardForm({ title: '', cost: 1000, icon: '🎁' });
      loadAllData();
    } catch (err) { showToast('error', err.message); }
    finally { setIsSaving(false); }
  };

  const handleDeleteReward = async (id) => {
    if (!confirm('¿Borrar esta recompensa?')) return;
    try {
      await profileService.deleteChannelReward(id);
      loadAllData();
    } catch (err) { showToast('error', err.message); }
  };

  const showToast = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  if (loading) return <div className="h-screen w-full bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Head><title>Panel de Creador | ChillStream</title></Head>
      <Navbar />

      <main className="pt-32 pb-20 px-[5%] max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-3xl">
          <div className="w-24 h-24 rounded-[30px] overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800 flex items-center justify-center text-3xl font-black">
            {profileForm.avatar_url ? <img src={profileForm.avatar_url} className="w-full h-full object-cover" /> : profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{profile?.username}</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-[3px] uppercase mt-1">{profile?.role} • {user?.email}</p>
          </div>
          <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'overview' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>ESTADÍSTICAS</button>
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>AJUSTES</button>
            {profile?.role === 'streamer' && <button onClick={() => setActiveTab('channel')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'channel' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>CANAL</button>}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Flow Actual 💰" description="Saldo convertible.">
                  <div className="mt-4 p-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[35px] shadow-2xl shadow-blue-600/20">
                    <h4 className="text-5xl font-black mb-2">${profile?.flow_balance?.toFixed(2) || '0.00'}</h4>
                    <p className="text-[10px] font-black text-blue-300 tracking-[3px] uppercase">Balance de ingresos</p>
                  </div>
                </Card>
                <Card title="Chill Points 🎮" description="Puntos de comunidad.">
                  <div className="mt-4 p-8 bg-zinc-900 border border-white/5 rounded-[35px] shadow-2xl">
                    <h4 className="text-5xl font-black mb-2 text-zinc-300">{profile?.chill_points || '0'}</h4>
                    <p className="text-[10px] font-black text-zinc-500 tracking-[3px] uppercase">Points por ver</p>
                  </div>
                </Card>
              </div>

              {profile?.role === 'streamer' && (
                <Card title="Ingresos Recientes 🌊" description="Últimas donaciones recibidas.">
                  <div className="mt-6 space-y-4">
                    {donations.map(don => (
                      <div key={don.id} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 font-black text-xs">{don.sender?.username?.charAt(0).toUpperCase()}</div>
                          <p className="text-sm font-black text-white">{don.sender?.username || 'Anónimo'}</p>
                        </div>
                        <p className="text-green-500 font-black text-lg">+ ${don.amount}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card title="Personalización Pro" description="Configura tu identidad y pagos directos.">
                <form onSubmit={handleSaveProfile} className="mt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Nombre completo..." />
                    <input type="text" value={profileForm.avatar_url} onChange={e => setProfileForm({...profileForm, avatar_url: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="URL Avatar..." />
                  </div>
                  <textarea rows="3" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Cuéntale al mundo quién eres..." />
                  <div className="bg-blue-600/5 p-8 rounded-[35px] border border-blue-600/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={profileForm.paypal_url} onChange={e => setProfileForm({...profileForm, paypal_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="PayPal.me link" />
                    <input type="text" value={profileForm.kofi_url} onChange={e => setProfileForm({...profileForm, kofi_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Ko-fi link" />
                  </div>
                  <button type="submit" disabled={isSaving} className="px-12 py-5 bg-blue-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20">GUARDAR TODO</button>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'channel' && (
            <motion.div key="channel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* GESTIÓN DE RECOMPENSAS (LA TIENDA DEL STREAMER) */}
              <Card title="Tienda de Recompensas 🎁" description="Crea retos o premios para que tus fans gasten sus Chill Points.">
                <form onSubmit={handleAddReward} className="mt-8 flex flex-col md:flex-row gap-4 mb-10">
                  <input type="text" required value={rewardForm.icon} onChange={e => setRewardForm({...rewardForm, icon: e.target.value})} className="w-20 bg-black border border-white/10 p-4 rounded-2xl text-center text-xl" placeholder="🎁" />
                  <input type="text" required value={rewardForm.title} onChange={e => setRewardForm({...rewardForm, title: e.target.value})} className="flex-1 bg-black border border-white/10 p-4 rounded-2xl text-sm font-bold" placeholder="Título de la recompensa (ej: Saludo especial)" />
                  <input type="number" required value={rewardForm.cost} onChange={e => setRewardForm({...rewardForm, cost: parseInt(e.target.value)})} className="w-32 bg-black border border-white/10 p-4 rounded-2xl text-sm font-bold text-blue-500" placeholder="Coste CP" />
                  <button type="submit" disabled={isSaving} className="px-8 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">AÑADIR</button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.length > 0 ? rewards.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{r.icon}</span>
                        <div>
                          <p className="text-sm font-black text-white">{r.title}</p>
                          <p className="text-[10px] font-black text-blue-500 tracking-widest">{r.cost} CP</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteReward(r.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all text-xs font-black uppercase">Borrar</button>
                    </div>
                  )) : <p className="text-center text-zinc-600 text-xs py-10 border border-dashed border-white/5 rounded-3xl uppercase font-black">Aún no has creado premios para tu comunidad.</p>}
                </div>
              </Card>

              <Card title="Credenciales Secretas" description="Información vital para OBS Studio.">
                <div className="mt-6 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex justify-between items-center">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Zona de Seguridad</span>
                  <button onClick={() => window.location.href = '/empezar'} className="text-xs font-black underline hover:text-white transition-all uppercase">Ver mi clave de stream</button>
                </div>
              </Card>

            </motion.div>
          )}
        </AnimatePresence>

        {statusMsg.text && (
          <div className={`fixed bottom-10 right-10 p-6 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl z-50 ${statusMsg.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {statusMsg.text}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
