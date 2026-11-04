import { cn } from "@/lib/utils";

const V: Record<string,string> = {
  default: "bg-[#e8eef5] text-[#4a6580]",
  success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  warning: "bg-amber-50 text-amber-600 border border-amber-200",
  danger:  "bg-rose-50 text-rose-600 border border-rose-200",
  accent:  "bg-purple-50 text-purple-600 border border-purple-200",
  outline: "border border-[#cdd8e8] text-[#4a6580]",
  sky:     "bg-sky-50 text-sky-600 border border-sky-200",
};

export function Badge({ children, variant="default", className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold",V[variant]??V.default,className)}>{children}</span>;
}
