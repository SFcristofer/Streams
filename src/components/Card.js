import { cn } from "../lib/utils";

export default function Card({ children, title, description, className, variant = 'main' }) {
  return (
    <div className={cn(
      "relative group overflow-hidden rounded-[24px] border border-white/5 bg-[#0a0a0a] p-8 transition-all hover:border-blue-500/50",
      className
    )}>
      {/* Efecto de resplandor sutil de fondo */}
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 transition group-hover:opacity-100" />
      
      <div className="relative z-10">
        {title && <h1 className="mb-2 text-2xl font-black tracking-tight text-white">{title}</h1>}
        {description && <p className="mb-6 text-sm leading-relaxed text-zinc-500">{description}</p>}
        {children}
      </div>
    </div>
  );
}
