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
  const [formData, setFormData] = useState({
    login: "ivan.ivanov@mirea.ru",
    password: "123456",
    email: "",
    fullName: "",
    group: "",
    studentId: "",
  });
  const [providerMode, setProviderMode] = useState<"LKS" | "ATTENDANCE">("LKS");

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
          providerMode,
        });
      } else {
        await register({
          email: formData.email,
          fullName: formData.fullName,
          group: formData.group,
          studentId: formData.studentId,
          password: formData.password,
          providerMode,
        });
      }
    } catch {
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <CosmicBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-cyan-200/30 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_42px_rgba(34,211,238,0.16)] p-8">
          <h1 className="text-3xl font-bold text-center text-cyan-100 mb-1">MireaCoin</h1>
          <p className="text-xs text-center text-slate-400 uppercase tracking-widest mb-8">Платформа активности</p>

          <div className="flex gap-2 mb-6 border border-cyan-200/20 rounded-xl p-1 bg-slate-900/40">
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

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Provider Mode</label>
            <div className="flex gap-2">
              {(["LKS", "ATTENDANCE"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setProviderMode(mode)}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition ${
                    providerMode === mode
                      ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                      : "border-slate-600/40 bg-slate-800/30 text-slate-400 hover:border-slate-500/60"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
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
              className="w-full py-3 text-base font-semibold shadow-[0_0_28px_rgba(34,211,238,0.24)]"
            >
              {isBusy ? "Загружаем..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </NeonButton>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Демо-учетные данные для тестирования указаны по умолчанию ↑
          </p>
        </div>
      </div>
    </main>
  );
}