import { cn } from "@/lib/utils";

interface ProgressBarProps { value: number; max?: number; color?: string; className?: string; size?: "sm"|"md"; }

export function ProgressBar({ value, max=100, color="bg-sky-400", className, size="md" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full rounded-full bg-[#e8eef5] overflow-hidden", size==="sm"?"h-1":"h-2")}>
        <div className={cn("h-full rounded-full transition-all duration-300", color)} style={{ width:`${pct}%` }} />
      </div>
    </div>
  );
}
