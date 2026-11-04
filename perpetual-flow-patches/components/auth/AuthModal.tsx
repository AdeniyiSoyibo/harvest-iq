"use client";
import { useState } from "react";
import { LogIn, X, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/lib/userContext";
import type { Tier } from "@/lib/userContext";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useUser();
  const [tab, setTab] = useState<"in"|"up">("in");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [show, setShow] = useState(false);
  const [tier, setTier] = useState<Tier>("free");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ id: "u1", name: name||email.split("@")[0], email, tier, avatarInitials: (name||email).slice(0,2).toUpperCase() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#1a2a3a]">{tab==="in"?"Sign In":"Create Account"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#e8eef5] text-[#7a9abf]"><X className="w-4 h-4"/></button>
        </div>
        <div className="flex gap-1 mb-4 bg-[#f0f4f8] p-1 rounded-xl">
          {(["in","up"] as const).map((t)=>(
            <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab===t?"bg-white text-sky-600 shadow-sm":"text-[#4a6580]"}`}>
              {t==="in"?"Sign In":"Sign Up"}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-3">
          {tab==="up" && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Display name" className="w-full px-3 py-2 text-sm rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"/>}
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full px-3 py-2 text-sm rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"/>
          <div className="relative">
            <input type={show?"text":"password"} required value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" className="w-full px-3 py-2 pr-10 text-sm rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"/>
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a9abf]">{show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
          </div>
          {tab==="up" && (
            <select value={tier} onChange={e=>setTier(e.target.value as Tier)} className="w-full px-3 py-2 text-sm rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] focus:outline-none focus:border-sky-400">
              <option value="free">Free Tier</option>
              <option value="producer_pro">Producer Pro ($19.99/mo)</option>
              <option value="listener_premium">Listener Premium ($9.99/mo)</option>
              <option value="anr_enterprise">A&R Enterprise ($499/mo)</option>
            </select>
          )}
          <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 hover:opacity-90 flex items-center justify-center gap-2 shadow-sm">
            <LogIn className="w-4 h-4"/>{tab==="in"?"Sign In":"Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
