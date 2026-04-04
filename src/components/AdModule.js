export default function AdModule({ type = 'provider', syncTick, adKey }) {
  const endpoint = type === 'sys-module' ? '/api/sys-module' : '/api/provider';
  const url = adKey ? `${endpoint}?key=${adKey}&v=${syncTick}` : `${endpoint}?v=${syncTick}`;

  return (
    <div className="bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/5 overflow-hidden group hover:border-blue-500/20 transition-all">
      <div className="mb-2 px-3 flex items-center justify-between">
        <span className="text-[8px] font-black text-zinc-600 tracking-widest uppercase">Publicidad Patrocinada</span>
        <span className="w-1 h-1 bg-zinc-600 rounded-full group-hover:bg-blue-500 transition-colors"></span>
      </div>
      <iframe 
        key={`${type}-${syncTick}`} 
        src={url} 
        width="100%" 
        height="250" 
        className="rounded-xl grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
        style={{ border: 'none' }} 
        sandbox="allow-scripts allow-forms allow-same-origin" 
      />
    </div>
  );
}
