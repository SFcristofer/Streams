import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../services/profileService';

export default function Chat({ messages, onSendMessage, chillPoints = 0, streamerId, streamId }) {
  const [newMessage, setNewMessage] = useState('');
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (showRewards && streamerId) {
      loadRewards();
    }
  }, [showRewards, streamerId]);

  const loadRewards = async () => {
    try {
      const data = await profileService.getChannelRewards(streamerId);
      setRewards(data || []);
    } catch (err) { console.error(err); }
  };

  const handleRedeem = async (reward) => {
    if (chillPoints < reward.cost) return alert("No tienes suficientes puntos");
    setIsRedeeming(true);
    try {
      await profileService.redeemReward(reward, streamerId, streamId);
      setShowRewards(false);
    } catch (err) { alert(err.message); }
    finally { setIsRedeeming(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0e0e10] relative">
      {/* Cabecera */}
      <div className="h-[50px] px-4 flex items-center justify-between border-b border-white/5 bg-[#18181b] shrink-0 w-full">
        <h3 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase">Chat del Directo</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase">LIVE</span>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-1 px-2 rounded-md hover:bg-white/5 transition-colors leading-tight">
              <span className={`font-black text-sm mr-2 ${msg.mod ? 'text-blue-400' : 'text-zinc-400'}`}>{msg.user}:</span>
              <span className="text-zinc-200 text-sm break-words">{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* TIENDA DE RECOMPENSAS (OVERLAY) */}
      <AnimatePresence>
        {showRewards && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="absolute bottom-[140px] left-4 right-4 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tienda del Canal</span>
              <button onClick={() => setShowRewards(false)} className="text-xs">✕</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {rewards.map(r => (
                <button 
                  key={r.id} 
                  disabled={isRedeeming || chillPoints < r.cost}
                  onClick={() => handleRedeem(r)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group disabled:opacity-30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{r.icon}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-zinc-200">{r.title}</p>
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{r.cost} CP</p>
                    </div>
                  </div>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 font-black text-blue-400 uppercase">Canjear</span>
                </button>
              ))}
              {rewards.length === 0 && <p className="text-center py-8 text-[10px] font-bold text-zinc-600 uppercase">Sin recompensas activas</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Área de Input */}
      <div className="p-4 bg-[#18181b] border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
          <textarea rows="2" placeholder="Enviar un mensaje" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => {if(e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); handleSubmit(e);}}} className="w-full bg-[#1f1f23] border border-transparent focus:border-blue-500/50 p-3 rounded-lg text-sm text-white outline-none transition-all resize-none" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowRewards(!showRewards)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${showRewards ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-black/40 text-zinc-300'}`}>
                <span className="text-[12px]">🎁</span>
                <span className="text-[11px] font-black">{chillPoints} CP</span>
              </button>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all">Chat</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
