import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function scoreColor(score: number): string {
  return score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-rose-500";
}

export function scoreBg(score: number): string {
  return score >= 80
    ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
    : score >= 60
    ? "bg-amber-50 border border-amber-200 text-amber-600"
    : "bg-rose-50 border border-rose-200 text-rose-600";
}
