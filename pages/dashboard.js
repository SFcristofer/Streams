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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [profileForm, setProfileForm] = useState({
    full_name: '', bio: '', avatar_url: '',
    twitter_url: '', instagram_url: '', discord_url: '',
    paypal_url: '', kofi_url: ''
  });

  const [channelForm, setChannelForm] = useState({ title: '', category: 'Charlando' });
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
            full_name: p.full_name || '',
            bio: p.bio || '',
            avatar_url: p.avatar_url || '',
            twitter_url: p.twitter_url || '',
            instagram_url: p.instagram_url || '',
            discord_url: p.discord_url || '',
            paypal_url: p.paypal_url || '',
            kofi_url: p.kofi_url || ''
          });

          const { data: s } = await supabase.from('streams').select('*').eq('streamer_id', p.id).maybeSingle();
          if (s) {
            setStream(s);
            setChannelForm({ title: s.title || '', category: s.category || 'Charlando' });
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
      // Actualizar perfil incluyendo nuevos campos de pago
      const { error } = await supabase.from('profiles').update({
        full_name: profileForm.full_name,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        twitter_url: profileForm.twitter_url,
        instagram_url: profileForm.instagram_url,
        discord_url: profileForm.discord_url,
        paypal_url: profileForm.paypal_url,
        kofi_url: profileForm.kofi_url
      }).eq('id', user.id);
      
      if (error) throw error;
      showToast('success', '¡Perfil Pro guardado!');
      loadAllData();
    } catch (err) { showToast('error', err.message); }
    finally { setIsSaving(false); }
  };

  const showToast = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  if (loading) return <div className="h-screen w-full bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Head><title>Dashboard Pro | ChillStream</title></Head>
      <Navbar />

      <main className="pt-32 pb-20 px-[5%] max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-3xl">
          <div className="w-24 h-24 rounded-[30px] overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800 flex items-center justify-center text-3xl font-black">
            {profileForm.avatar_url ? <img src={profileForm.avatar_url} className="w-full h-full object-cover" /> : profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{profile?.username || 'Sin Identidad'}</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-[3px] uppercase mt-1">{profile?.role} • {user?.email}</p>
          </div>
          <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'overview' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>WALLET</button>
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>AJUSTES</button>
            {profile?.role === 'streamer' && <button onClick={() => setActiveTab('channel')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'channel' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>CANAL</button>}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* WALLET DUAL */}
              <Card title="Chill Flow 💰" description="Tu saldo de moneda real para donar y retirar.">
                <div className="mt-6 p-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[35px] shadow-2xl shadow-blue-600/20">
                  <h4 className="text-5xl font-black mb-2">${profile?.flow_balance?.toFixed(2) || '0.00'}</h4>
                  <p className="text-[10px] font-black text-blue-300 tracking-[3px] uppercase mb-6">Chill Flow disponible</p>
                  <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs hover:scale-[1.02] transition-all">RECARGAR SALDO</button>
                </div>
              </Card>

              <Card title="Chill Points 🎮" description="Puntos acumulados por ver directos.">
                <div className="mt-6 p-8 bg-zinc-900 border border-white/5 rounded-[35px] shadow-2xl">
                  <h4 className="text-5xl font-black mb-2 text-zinc-300">{profile?.chill_points || '0'}</h4>
                  <p className="text-[10px] font-black text-zinc-500 tracking-[3px] uppercase mb-6">Points por engagement</p>
                  <div className="p-4 bg-white/5 rounded-2xl text-[10px] font-bold text-zinc-400 text-center">¡Gana 10 CP cada 5 minutos viendo streams!</div>
                </div>
              </Card>

            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card title="Ajustes de Perfil Pro" description="Configura tus datos y métodos de pago externos.">
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

                  <div className="bg-blue-600/5 p-8 rounded-[35px] border border-blue-600/10">
                    <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Métodos de Apoyo Directo (Sin Comisión)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" value={profileForm.paypal_url} onChange={e => setProfileForm({...profileForm, paypal_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Enlace de PayPal.me" />
                      <input type="text" value={profileForm.kofi_url} onChange={e => setProfileForm({...profileForm, kofi_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Enlace de Ko-fi" />
                    </div>
                  </div>

                  <button type="submit" disabled={isSaving} className="px-12 py-5 bg-blue-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20">GUARDAR CAMBIOS PROFESIONALES</button>
                </form>
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
