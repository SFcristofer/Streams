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
  
  // Estados para formularios
  const [profileForm, setProfileForm] = useState({
    full_name: '', bio: '', avatar_url: '',
    twitter_url: '', instagram_url: '', discord_url: ''
  });

  const [channelForm, setChannelForm] = useState({
    title: '', category: 'Charlando'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const PENTIUM_RTMP_URL = 'rtmp://192.168.100.24/ingest';

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
            discord_url: p.discord_url || ''
          });

          // Traer datos del canal si existen
          const { data: s } = await supabase
            .from('streams')
            .select('*')
            .eq('streamer_id', p.id)
            .maybeSingle();
          
          if (s) {
            setStream(s);
            setChannelForm({
              title: s.title || '',
              category: s.category || 'Charlando'
            });
          }
        }
      } catch (err) {
        console.error("Error al cargar:", err);
      }
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateFullProfile(profileForm);
      showToast('success', '¡Perfil guardado!');
      loadAllData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChannel = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateStreamInfo(stream.id, channelForm);
      showToast('success', '¡Canal actualizado!');
      loadAllData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivateChannel = async () => {
    setIsSaving(true);
    try {
      await profileService.becomeStreamer();
      showToast('success', '¡Canal Activado con éxito!');
      loadAllData();
    } catch (err) {
      showToast('error', 'Error al sincronizar con Pentium');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('success', '¡Copiado al portapapeles!');
  };

  const showToast = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  if (loading) return <div className="h-screen w-full bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Head><title>Dashboard | ChillStream</title></Head>
      <Navbar />

      <main className="pt-32 pb-20 px-[5%] max-w-7xl mx-auto">
        
        {/* CABECERA PRO */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-3xl relative overflow-hidden">
          <div className="w-24 h-24 rounded-[30px] overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800 flex items-center justify-center text-3xl font-black">
            {profileForm.avatar_url ? <img src={profileForm.avatar_url} className="w-full h-full object-cover" /> : profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{profile?.username || 'Cargando...'}</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-[3px] uppercase mt-1">{profile?.role} • {user?.email}</p>
          </div>
          <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'overview' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>RESUMEN</button>
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>PERFIL</button>
            <button onClick={() => setActiveTab('channel')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'channel' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>CANAL</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card title="Identidad" description="Tu estatus actual.">
                <div className="mt-4 p-6 bg-white/5 rounded-2xl">
                  <h4 className={`text-xl font-black ${profile?.role === 'streamer' ? 'text-green-500' : 'text-blue-500'}`}>{profile?.role?.toUpperCase()}</h4>
                  <p className="text-[9px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">{profile?.role === 'streamer' ? 'Canal verificado en Pentium' : 'Cuenta de espectador'}</p>
                </div>
              </Card>
              <Card title="Diamantes 💎" description="Saldo disponible.">
                <div className="mt-4 p-6 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl shadow-xl shadow-blue-500/20">
                  <h4 className="text-3xl font-black text-white">{profile?.diamonds?.toFixed(2) || '0.00'}</h4>
                </div>
              </Card>
              <Card title="Seguridad" description="Clave de stream.">
                <div className="mt-4">
                  {stream ? (
                    <button onClick={() => setActiveTab('channel')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Ver Credenciales</button>
                  ) : (
                    <button onClick={handleActivateChannel} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Activar Canal</button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card title="Editar Perfil" description="Personaliza tu información pública.">
                <form onSubmit={handleSaveProfile} className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Nombre real..." />
                    <input type="text" value={profileForm.avatar_url} onChange={e => setProfileForm({...profileForm, avatar_url: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="URL Avatar..." />
                  </div>
                  <textarea rows="3" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Biografía..." />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={profileForm.twitter_url} onChange={e => setProfileForm({...profileForm, twitter_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Twitter (X)" />
                    <input type="text" value={profileForm.instagram_url} onChange={e => setProfileForm({...profileForm, instagram_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Instagram" />
                    <input type="text" value={profileForm.discord_url} onChange={e => setProfileForm({...profileForm, discord_url: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Discord" />
                  </div>
                  <button type="submit" disabled={isSaving} className="px-10 py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest">GUARDAR PERFIL</button>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'channel' && (
            <motion.div key="channel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {!stream ? (
                <Card title="Activar Canal" description="Comienza a transmitir en la Red Pentium.">
                  <div className="text-center py-10">
                    <p className="text-zinc-500 mb-8 text-sm">Aún no has activado tu espacio de creador.</p>
                    <button onClick={handleActivateChannel} disabled={isSaving} className="px-12 py-5 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20">GENERAR MI LLAVE DE STREAM</button>
                  </div>
                </Card>
              ) : (
                <>
                  <Card title="Credenciales de Transmisión 🔐" description="Copia estos datos en OBS Studio para salir al aire.">
                    <div className="mt-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-2">Servidor RTMP</label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-black border border-white/10 p-4 rounded-xl font-mono text-xs text-blue-400">{PENTIUM_RTMP_URL}</div>
                          <button onClick={() => copyToClipboard(PENTIUM_RTMP_URL)} className="px-4 bg-white/5 rounded-xl hover:bg-white/10">📋</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-2">Clave de Transmisión (Secret)</label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-black border border-white/10 p-4 rounded-xl font-mono text-xs text-red-500">
                            {showKey ? stream.stream_key : '••••••••••••••••••••••••••••'}
                          </div>
                          <button onClick={() => setShowKey(!showKey)} className="px-4 bg-white/5 rounded-xl hover:bg-white/10">{showKey ? '👁️' : '🔒'}</button>
                          <button onClick={() => copyToClipboard(stream.stream_key)} className="px-4 bg-white/5 rounded-xl hover:bg-white/10">📋</button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Configuración de Directo" description="Título y categoría para tu sala.">
                    <form onSubmit={handleSaveChannel} className="mt-8 space-y-6">
                      <input type="text" value={channelForm.title} onChange={e => setChannelForm({...channelForm, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none" placeholder="Título del stream..." />
                      <select value={channelForm.category} onChange={e => setChannelForm({...channelForm, category: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl focus:border-blue-500 outline-none">
                        <option>Charlando</option><option>Gaming</option><option>Música</option><option>Tecnología</option>
                      </select>
                      <button type="submit" disabled={isSaving} className="px-10 py-4 bg-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all">ACTUALIZAR CANAL</button>
                    </form>
                  </Card>
                </>
              )}
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
