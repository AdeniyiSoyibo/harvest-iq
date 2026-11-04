"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Disc3, Radio, Music2, Users, Film, Tag, Store, Menu, X,
  LogIn, LogOut, ChevronDown, Download, Zap,
} from "lucide-react";
import { useUser } from "@/lib/userContext";
import type { Tier } from "@/lib/userContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { GlobalPlayerBar } from "@/components/layout/GlobalPlayerBar";
import { usePlatformStore } from "@/lib/store";

const TEST_PROFILES: { tier: Tier; label: string; color: string }[] = [
  { tier: "free",             label: "Free",       color: "bg-slate-400"  },
  { tier: "producer_pro",     label: "Pro",        color: "bg-sky-500"    },
  { tier: "listener_premium", label: "Premium",    color: "bg-purple-500" },
  { tier: "anr_enterprise",   label: "Enterprise", color: "bg-amber-500"  },
];

const NAV_ITEMS = [
  { href: "/",            label: "Production",   icon: Disc3    },
  { href: "/streaming",   label: "Streaming",    icon: Radio    },
  { href: "/dj",          label: "DJ Mode",      icon: Music2   },
  { href: "/anr",         label: "A&R",          icon: Users    },
  { href: "/video",       label: "Video",        icon: Film     },
  { href: "/marketplace", label: "Marketplace",  icon: Store    },
  { href: "/pricing",     label: "Pricing",      icon: Tag      },
  { href: "/download",    label: "Download App", icon: Download },
];

const TIER_LABELS: Record<string, string> = {
  free: "Free", producer_pro: "Pro", listener_premium: "Premium", anr_enterprise: "Enterprise",
};
const TIER_COLORS: Record<string, string> = {
  free:             "bg-slate-100 text-slate-500",
  producer_pro:     "bg-sky-100 text-sky-700",
  listener_premium: "bg-purple-100 text-purple-700",
  anr_enterprise:   "bg-amber-100 text-amber-700",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signIn, signOut } = useUser();
  const { currentTrack } = usePlatformStore();
  const hasPlayer = !!currentTrack;
  const [showTestPanel, setShowTestPanel] = useState(false);

  const quickSignIn = (tier: Tier) => {
    signIn({ id: "test-user", name: `Test ${tier.replace("_"," ")}`, email: "test@perceptualflow.app", tier, avatarInitials: "TU" });
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#cdd8e8]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
          <Disc3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#1a2a3a] leading-none">Perceptual Flow</div>
          <div className="text-[10px] text-[#7a9abf] mt-0.5 font-medium">Music Intelligence v0.5</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#7a9abf] uppercase tracking-wider px-3 pb-1.5">Modes</p>
        {NAV_ITEMS.filter((n) => n.href !== "/download").map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-200"
                  : "text-[#4a6580] hover:text-[#1a2a3a] hover:bg-[#e8eef5]"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-sky-500" : ""}`} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
            </Link>
          );
        })}

        {/* ── Test Mode Panel ── */}
        <div className="pt-2">
          <button
            onClick={() => setShowTestPanel(v => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Test Mode — Switch Tier
          </button>
          {showTestPanel && (
            <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <p className="text-[10px] text-amber-700 font-semibold px-1">Click any tier to sign in instantly:</p>
              {TEST_PROFILES.map(({ tier, label, color }) => (
                <button
                  key={tier}
                  onClick={() => { quickSignIn(tier); setShowTestPanel(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white ${color} hover:opacity-90 transition-opacity ${user?.tier === tier ? "ring-2 ring-offset-1 ring-amber-400" : ""}`}
                >
                  {label} {user?.tier === tier && "✓"}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => { signOut(); setShowTestPanel(false); }}
                  className="w-full text-[10px] text-amber-600 hover:text-amber-800 py-1 text-center transition-colors"
                >
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>

        {/* Download CTA — highlighted separately */}
        <div className="pt-2">
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase tracking-wider px-3 pb-1.5">Desktop</p>
          <Link href="/download" onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === "/download"
                ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-200"
                : "text-sky-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-100"
            }`}
          >
            <Download className="w-4 h-4 flex-shrink-0 text-sky-500" />
            Download App
            <span className="ml-auto text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded-full">FREE</span>
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-[#cdd8e8]">
        {user ? (
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#e8eef5] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user.avatarInitials}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-[#1a2a3a] truncate">{user.name}</div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TIER_COLORS[user.tier]}`}>
                  {TIER_LABELS[user.tier]}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#7a9abf]" />
            </button>
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#cdd8e8] rounded-xl shadow-lg overflow-hidden z-50">
                <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#4a6580] hover:text-[#1a2a3a] hover:bg-[#f0f4f8] transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setAuthOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#4a6580] hover:text-[#1a2a3a] hover:bg-[#e8eef5] transition-colors"
          >
            <LogIn className="w-4 h-4 text-sky-500" /> Sign In / Register
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#cdd8e8] h-full flex-shrink-0 shadow-sm">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-[#cdd8e8] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <Disc3 className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-[#1a2a3a]">Perceptual Flow</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-[#7a9abf] hover:text-[#1a2a3a]">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white border-r border-[#cdd8e8] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className={`flex-1 overflow-y-auto lg:pt-0 pt-14 ${hasPlayer ? "pb-16" : ""}`}>
        {children}
      </main>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <GlobalPlayerBar />
    </div>
  );
}
