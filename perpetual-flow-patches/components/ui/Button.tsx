import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary"|"secondary"|"ghost"|"danger"; size?: "sm"|"md"|"lg";
}

const V = { primary:"bg-gradient-to-r from-sky-400 to-blue-600 text-white hover:opacity-90", secondary:"bg-[#e8eef5] text-[#1a2a3a] hover:bg-[#cdd8e8]", ghost:"text-[#4a6580] hover:text-[#1a2a3a] hover:bg-[#e8eef5]", danger:"bg-red-50 text-red-600 hover:bg-red-100" };
const S = { sm:"px-2.5 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-6 py-3 text-base" };

export function Button({ variant="secondary", size="md", className, children, ...p }: ButtonProps) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm",V[variant],S[size],className)} {...p}>{children}</button>;
}
