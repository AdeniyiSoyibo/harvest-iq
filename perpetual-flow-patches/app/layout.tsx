import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { UserProvider } from "@/lib/userContext";

export const metadata: Metadata = {
  title: "Perceptual Flow — Unified Music Intelligence Platform",
  description: "AI-powered production, streaming, DJ, A&R, and video tools built around perceptual flow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <AppShell>{children}</AppShell>
        </UserProvider>
      </body>
    </html>
  );
}
