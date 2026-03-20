"use client";

import { CosmicBackground } from "@/components/layout/CosmicBackground";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const isBusy = useAppStore((s) => s.isBusy);
  const error = useAppStore((s) => s.error);
  const clearError = useAppStore((s) => s.clearError);

  const login = useAppStore((s) => s.login);
  const register = useAppStore((s) => s.register);

  useEffect(() => {
    if (user) {
      router.replace("/app");
    }
  }, [user, router]);

  const [mode, setMode] = useState<Mode>("login");
  const [isMireaAvailable, setIsMireaAvailable] = useState(false);
  const [mireaMessage, setMireaMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    login: "ivan.ivanov@mirea.ru",
    password: "123456",
    email: "",
    fullName: "",
    group: "",
    studentId: "",
  });

  useEffect(() => {
    let cancelled = false;

    const checkMireaProvider = async () => {
      try {
        const response = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("unavailable");
        }

        const providers = (await response.json()) as Record<string, unknown>;
        const available = Boolean(providers?.mirea);

        if (!cancelled) {
          setIsMireaAvailable(available);
          setMireaMessage(available ? null : "Авторизация через МИРЭА временно недоступна");
        }
      } catch {
        if (!cancelled) {
          setIsMireaAvailable(false);
          setMireaMessage("Авторизация через МИРЭА временно недоступна");
        }
      }
    };

    checkMireaProvider();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (mode === "login") {
        await login({
          login: formData.login,
          password: formData.password,
          providerMode: "LKS",
        });
      } else {
        await register({
          email: formData.email,
          fullName: formData.fullName,
          group: formData.group,
          studentId: formData.studentId,
          password: formData.password,
          providerMode: "LKS",
        });
      }
    } catch {
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <CosmicBackground />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="premium-card rounded-3xl p-8">
          <h1 className="text-3xl font-bold text-center text-cyan-100 mb-1">MireaCoin</h1>
          <p className="text-xs text-center text-slate-400 uppercase tracking-widest mb-8">Платформа активности • Beta</p>

          <div className="mb-8 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                clearError();
              }}
              disabled={!isMireaAvailable}
              className={[
                "rounded-2xl p-4 text-left transition border premium-card",
                isMireaAvailable
                  ? "border-white/10 bg-black/25 hover:border-cyan-200/35"
                  : "border-amber-300/35 bg-amber-400/10",
              ].join(" ")}
            >
              <div className="text-xs uppercase tracking-widest text-cyan-200/80">Основной поток</div>
              <div className="mt-1 text-sm font-semibold text-white">Войти через МИРЭА</div>
              <div className="mt-2 text-xs text-slate-400">Для синхронизации учебных данных</div>
              {!isMireaAvailable && (
                <div className="mt-3 inline-flex rounded-full border border-amber-300/45 bg-amber-300/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100">
                  Недоступно
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                clearError();
              }}
              className="premium-card rounded-2xl border border-cyan-200/35 bg-cyan-300/10 p-4 text-left hover:bg-cyan-300/15 transition"
            >
              <div className="text-xs uppercase tracking-widest text-cyan-100/90">Ранний доступ</div>
              <div className="mt-1 text-sm font-semibold text-white">Участвовать в бета-тесте</div>
              <div className="mt-2 text-xs text-slate-300">Регистрация и вход в актуальную версию</div>
            </button>
          </div>

          {mireaMessage && (
            <div className="mb-6 rounded-xl border border-amber-300/45 bg-amber-400/12 px-4 py-3 text-sm text-amber-100">
              {mireaMessage}
            </div>
          )}

          <div className="flex gap-2 mb-6 border border-cyan-200/20 rounded-xl p-1 bg-slate-900/45">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                clearError();
              }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition ${
                mode === "login"
                  ? "bg-cyan-400/20 text-cyan-100 border border-cyan-300/50"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                clearError();
              }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition ${
                mode === "register"
                  ? "bg-cyan-400/20 text-cyan-100 border border-cyan-300/50"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-cyan-200/20 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-900 transition"
                  required
                />
                <input
                  type="text"
                  placeholder="ФИО"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-cyan-200/20 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-900 transition"
                  required
                />
                <input
                  type="text"
                  placeholder="Группа (ИКБО-01-23)"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-cyan-200/20 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-900 transition"
                  required
                />
                <input
                  type="text"
                  placeholder="Студент ID (MIR-230011)"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-cyan-200/20 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-900 transition"
                  required
                />
              </>
            )}

            {mode === "login" && (
              <>
                <input
                  type="text"
                  placeholder="Email или Student ID"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-cyan-200/20 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-900 transition"
                  required
                />
              </>
            )}

            <input
              type="password"
              placeholder="Пароль"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-cyan-200/20 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-900 transition"
              required
            />

            {error && <div className="px-3 py-2 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300">{error}</div>}

            <NeonButton
              type="submit"
              disabled={isBusy}
              className="w-full py-3 text-base font-semibold"
            >
              {isBusy ? "Загружаем..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </NeonButton>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
              Демо-учетные данные для beta-теста указаны по умолчанию ↑
          </p>
        </div>
      </div>
    </main>
  );
}