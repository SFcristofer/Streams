import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat({ messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Cabecera del Chat (Fija) */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
        <h3 className="text-[10px] font-black tracking-[3px] text-zinc-500 uppercase">Chat en Vivo</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-zinc-400">LIVE</span>
        </div>
      </div>

      {/* Área de Mensajes (Scrollable) */}
      <div ref={scrollRef} className="flex-1 min-h-0 p-6 overflow-y-auto space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <span className={msg.mod ? "text-blue-400 font-black text-xs" : "text-zinc-500 font-bold text-xs"}>
                  {msg.user}
                </span>
                {msg.mod && <span className="bg-blue-500/20 text-blue-400 text-[8px] px-1 rounded font-black uppercase tracking-tighter">MOD</span>}
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed break-words">{msg.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input de Chat (Fijo abajo) */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/60 border-t border-white/5 flex gap-2 shrink-0">
        <input 
          type="text" 
          placeholder="Envía un mensaje..." 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-lg shadow-blue-600/20">
          🚀
        </button>
      </form>
    </div>
  );
}
