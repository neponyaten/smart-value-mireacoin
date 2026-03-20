"use client";

import { AppNavigation } from "@/components/layout/AppNavigation";
import { CosmicBackground } from "@/components/layout/CosmicBackground";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const isSessionLoading = useAppStore((s) => s.isSessionLoading);
  const hydrateSession = useAppStore((s) => s.hydrateSession);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (!isSessionLoading && !user) {
      router.replace("/auth");
    }
  }, [isSessionLoading, user, router]);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-200/30 border-t-cyan-300 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Загружаем вашу сессию...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen text-white">
      <CosmicBackground />
      <div className="relative z-0 pb-32">{children}</div>
      <AppNavigation />
    </div>
  );
}