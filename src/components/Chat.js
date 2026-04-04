import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../services/profileService';
import { supabase } from '../lib/supabase';

export default function Chat({ messages, onSendMessage, chillPoints = 0, streamerId, streamId }) {
  const [newMessage, setNewMessage] = useState('');
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  // Estado para el input de recompensa
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardInput, setRewardInput] = useState('');

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (showRewards && streamerId) loadRewards();
  }, [showRewards, streamerId]);

  const loadRewards = async () => {
    const data = await profileService.getChannelRewards(streamerId);
    setRewards(data || []);
  };

  const handleSelectReward = (reward) => {
    if (chillPoints < reward.cost) return alert("Puntos insuficientes");
    setSelectedReward(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setIsRedeeming(true);
    try {
      // 1. Restar puntos y registrar canje
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: pError } = await supabase
        .from('profiles')
        .update({ chill_points: chillPoints - selectedReward.cost })
        .eq('id', user.id);
      if (pError) throw pError;

      await supabase.from('reward_redemptions').insert([{
        reward_id: selectedReward.id,
        user_id: user.id,
        streamer_id: streamerId,
        user_input: rewardInput,
        status: 'pending'
      }]);

      await supabase.from('messages').insert([{
        stream_id: streamId,
        user_id: user.id,
        username: 'SISTEMA',
        content: `🎁 @Usuario canjeó: ${selectedReward.title} ${rewardInput ? ` - "${rewardInput}"` : ''}`
      }]);

      setSelectedReward(null);
      setRewardInput('');
      setShowRewards(false);
    } catch (err) { alert(err.message); }
    finally { setIsRedeeming(true); setIsRedeeming(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0e0e10] relative">
      <div className="h-[50px] px-4 flex items-center justify-between border-b border-white/5 bg-[#18181b] shrink-0 w-full">
        <h3 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase">Chat en Vivo</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <div key={msg.id} className="py-1 px-2 rounded-md hover:bg-white/5 transition-colors leading-tight">
              <span className={`font-black text-sm mr-2 ${msg.mod ? 'text-blue-400' : 'text-zinc-400'}`}>{msg.user}:</span>
              <span className="text-zinc-200 text-sm break-words">{msg.text}</span>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* TIENDA Y CANJE */}
      <AnimatePresence>
        {showRewards && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="absolute bottom-[140px] left-4 right-4 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {!selectedReward ? (
              <div className="p-4">
                <span className="text-[10px] font-black uppercase text-zinc-500 mb-4 block">Premios del Canal</span>
                <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar">
                  {rewards.map(r => (
                    <button key={r.id} onClick={() => handleSelectReward(r)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 disabled:opacity-30">
                      <div className="flex items-center gap-3"><span className="text-xl">{r.icon}</span><div className="text-left"><p className="text-xs font-bold text-zinc-200">{r.title}</p><p className="text-[9px] font-black text-blue-500 uppercase">{r.cost} CP</p></div></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{selectedReward.icon}</span>
                  <div><h4 className="font-black text-sm">{selectedReward.title}</h4><p className="text-[10px] text-blue-500 font-black uppercase">Coste: {selectedReward.cost} CP</p></div>
                </div>
                {selectedReward.type === 'tts' && (
                  <textarea value={rewardInput} onChange={e => setRewardInput(e.target.value)} placeholder="Escribe el mensaje que quieres que suene..." className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-blue-500" rows="3"></textarea>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setSelectedReward(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase">Cancelar</button>
                  <button onClick={handleConfirmRedeem} disabled={isRedeeming} className="flex-1 py-3 rounded-xl bg-blue-600 text-[10px] font-black uppercase">Confirmar Canje</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-[#18181b] border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
          <textarea rows="2" placeholder="Enviar mensaje" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="w-full bg-[#1f1f23] border border-transparent focus:border-blue-500/50 p-3 rounded-lg text-sm text-white outline-none resize-none" />
          <div className="flex justify-between items-center">
            <button type="button" onClick={() => setShowRewards(!showRewards)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-black/40 text-zinc-300">
              <span className="text-[12px]">🎁</span><span className="text-[11px] font-black">{chillPoints} CP</span>
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest">Chat</button>
          </div>
        </form>
      </div>
    </div>
  );
}
