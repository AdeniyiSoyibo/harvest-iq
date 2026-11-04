import { cn } from "@/lib/utils";

interface CardProps { children: React.ReactNode; className?: string; title?: string; subtitle?: string; glow?: boolean; }

export function Card({ children, className, title, subtitle, glow }: CardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-[#cdd8e8] shadow-sm overflow-hidden", glow && "ring-2 ring-sky-300/50 shadow-sky-100", className)}>
      {(title || subtitle) && (
        <div className="px-5 py-3 border-b border-[#e8eef5]">
          {title && <h3 className="text-sm font-bold text-[#1a2a3a]">{title}</h3>}
          {subtitle && <p className="text-xs text-[#7a9abf] mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
