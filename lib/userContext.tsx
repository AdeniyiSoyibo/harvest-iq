"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export type Tier = "free" | "producer_pro" | "listener_premium" | "anr_enterprise";

export interface AppUser {
  id: string; name: string; email: string; tier: Tier; avatarInitials: string;
}

interface UserCtx {
  user: AppUser | null;
  signIn: (u: AppUser) => void;
  signOut: () => void;
  hasAccess: (tier: Tier) => boolean;
}

const TIER_ORDER: Tier[] = ["free", "producer_pro", "listener_premium", "anr_enterprise"];

const UserContext = createContext<UserCtx>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  hasAccess: () => false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const hasAccess = (required: Tier): boolean => {
    if (!user) return required === "free";
    return TIER_ORDER.indexOf(user.tier) >= TIER_ORDER.indexOf(required);
  };
  return (
    <UserContext.Provider value={{ user, signIn: setUser, signOut: () => setUser(null), hasAccess }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() { return useContext(UserContext); }
