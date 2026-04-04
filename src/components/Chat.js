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
    <div className="flex flex-col h-full w-full bg-[#0e0e10]">
      {/* Cabecera estilo Twitch */}
      <div className="h-[50px] px-4 flex items-center justify-between border-b border-white/5 bg-[#18181b] shrink-0 w-full">
        <h3 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase">Chat del Directo</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Realtime</span>
        </div>
      </div>

      {/* Área de Mensajes (Máximo espacio) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-widest">
            Comienza la conversación...
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-1 px-2 rounded-md hover:bg-white/5 transition-colors leading-tight group"
              >
                <span className={`font-black text-sm mr-2 ${msg.mod ? 'text-blue-400' : 'text-zinc-400'}`}>
                  {msg.user}:
                </span>
                <span className="text-zinc-200 text-sm break-words font-medium">{msg.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Área de Input (Fija abajo) */}
      <div className="p-4 bg-[#18181b] border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
          <textarea 
            rows="2"
            placeholder="Enviar un mensaje" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="w-full bg-[#1f1f23] border border-transparent focus:border-blue-500/50 p-3 rounded-lg text-sm text-white outline-none transition-all resize-none placeholder:text-zinc-600"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-[10px] text-zinc-600 font-bold uppercase">Enter para enviar</span>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-black text-[10px] uppercase transition-all active:scale-95">
              Chat
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}
