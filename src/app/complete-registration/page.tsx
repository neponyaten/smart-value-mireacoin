"use client";

export const dynamic = "force-dynamic";

import { CosmicBackground } from "@/components/layout/CosmicBackground";
import { NeonButton } from "@/components/ui/NeonButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [step, setStep] = useState<"form" | "success" | "error">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentToken = params.get("token");
    setToken(currentToken);

    if (!currentToken) {
      setStep("error");
      setErrorMessage("Ссылка активации не найдена или некорректна");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!email || !password || !passwordConfirm) {
        setErrorMessage("Все поля должны быть заполнены");
        setIsLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        setErrorMessage("Пароли не совпадают");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage("Пароль должен быть не менее 6 символов");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/beta/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Ошибка при завершении регистрации");
        setIsLoading(false);
        return;
      }

      setStep("success");
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMessage("Ошибка при завершении регистрации");
      setIsLoading(false);
    }
  };

  return (
    <>
      <CosmicBackground />
      <main className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="mx-auto w-full max-w-md">
          {step === "form" && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-cyan-100">Завершите регистрацию</h1>
                <p className="mt-2 text-slate-400">Введите email и пароль для входа</p>
              </div>

              <form onSubmit={handleSubmit} className="premium-card rounded-2xl p-6 space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-red-900/50 bg-red-900/20 p-3 text-sm text-red-300">
                    {errorMessage}
                  </div>
                )}

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                    placeholder="ivan@example.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Пароль</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                    placeholder="••••••"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Повторите пароль</span>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                    placeholder="••••••"
                    required
                  />
                </label>

                <NeonButton type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Регистрация..." : "Завершить регистрацию"}
                </NeonButton>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="premium-card rounded-3xl p-8 text-center">
              <h1 className="text-3xl font-bold text-cyan-100">✨ Добро пожаловать!</h1>
              <p className="mt-4 text-lg text-slate-300">
                Ваш аккаунт успешно создан.
              </p>
              <p className="mt-2 text-slate-400">
                Теперь вы можете войти в MireaCoin и начать участвовать.
              </p>
              <button
                onClick={() => router.push("/auth")}
                className="mt-8 inline-block rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Перейти к входу
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="premium-card rounded-3xl p-8 text-center">
              <h1 className="text-3xl font-bold text-red-400">Ошибка</h1>
              <p className="mt-4 text-lg text-slate-300">{errorMessage}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-8 inline-block rounded-xl border border-slate-700/70 bg-slate-900/45 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900/60"
              >
                Вернуться на главную
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
