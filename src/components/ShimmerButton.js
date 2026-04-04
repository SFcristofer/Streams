import { cn } from "../lib/utils";

export default function ShimmerButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700 active:scale-95",
        className
      )}
      {...props}
    >
      {/* Efecto Shimmer */}
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
        <div className="relative h-full w-8 bg-white/20" />
      </div>
      
      <span className="relative z-10">{children}</span>
      
      {/* Sombra de brillo inferior */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
    </button>
  );
}
