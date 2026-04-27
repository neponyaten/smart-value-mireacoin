"use client";

import { CosmicBackground } from "@/components/layout/CosmicBackground";
import { NeonButton } from "@/components/ui/NeonButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    academicGroup: "",
    requestedRole: "Студент",
    whyJoinBeta: "",
    telegramUrl: "",
    vkUrl: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/beta/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Ошибка при отправке заявки");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Ошибка при отправке заявки");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CosmicBackground />
      <main className="relative min-h-screen px-4 py-20">
        <div className="mx-auto w-full max-w-2xl">
          {submitted ? (
            <div className="premium-card rounded-3xl p-8 text-center">
              <h1 className="text-3xl font-bold text-cyan-100">Спасибо!</h1>
              <p className="mt-4 text-lg text-slate-300">
                Ваша заявка на участие в бета-тесте MireaCoin получена.
              </p>
              <p className="mt-2 text-slate-400">
                Мы свяжемся с вами по почте <span className="font-semibold text-cyan-100">{formData.email}</span>
              </p>
              <p className="mt-6 text-sm text-slate-500">
                Ответ обычно приходит в течение 24 часов.
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-8 inline-block rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Вернуться на главную
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-cyan-100">Подать заявку на бета-тест</h1>
                <p className="mt-2 text-slate-400">
                  Присоединяйтесь к нашему сообществу ранних тестировщиков MireaCoin
                </p>
              </div>

              <div className="premium-card rounded-2xl p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-slate-400">ФИО</span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                      placeholder="Иван Иванов"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                      placeholder="ivan@example.com"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Группа</span>
                    <input
                      type="text"
                      name="academicGroup"
                      value={formData.academicGroup}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                      placeholder="КИББ-01-24"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Роль</span>
                    <select
                      name="requestedRole"
                      value={formData.requestedRole}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                      required
                    >
                      <option value="Студент">Студент</option>
                      <option value="Преподаватель">Преподаватель</option>
                      <option value="Админ">Админ группы</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Почему ты хочешь участвовать?</span>
                  <textarea
                    name="whyJoinBeta"
                    value={formData.whyJoinBeta}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                    placeholder="Расскажи, почему тебя интересует MireaCoin..."
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Telegram (опционально)</span>
                  <input
                    type="url"
                    name="telegramUrl"
                    value={formData.telegramUrl}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                    placeholder="https://t.me/username"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate-400">VK (опционально)</span>
                  <input
                    type="url"
                    name="vkUrl"
                    value={formData.vkUrl}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                    placeholder="https://vk.com/username"
                  />
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-900/45 p-3">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 size-4 accent-cyan-400"
                    required
                  />
                  <span className="text-sm leading-relaxed text-slate-300">
                    Я согласен(а) с условиями участия в бета-тесте и обработкой моих личных данных
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <NeonButton
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3"
                >
                  {isLoading ? "Отправка..." : "Отправить заявку"}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900/60"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
