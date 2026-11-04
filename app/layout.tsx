import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { UserProvider } from "@/lib/userContext";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Perceptual Flow — Unified Music Intelligence Platform",
  description: "AI-powered production, streaming, DJ, A&R, and video tools built around perceptual flow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <UserProvider>
            <AppShell>{children}</AppShell>
          </UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
