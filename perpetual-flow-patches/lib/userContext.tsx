"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export type Tier = "free" | "producer_pro" | "listener_premium" | "anr_enterprise";

export interface AppUser {
  id: string; name: string; email: string; tier: Tier; avatarInitials: string;
}

interface UserCtx { user: AppUser | null; signIn: (u: AppUser) => void; signOut: () => void; }

const UserContext = createContext<UserCtx>({ user: null, signIn: () => {}, signOut: () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  return (
    <UserContext.Provider value={{ user, signIn: setUser, signOut: () => setUser(null) }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() { return useContext(UserContext); }
