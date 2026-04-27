import Link from "next/link";

const adminSections = [
  { href: "/admin/applications", label: "Applications", desc: "Заявки на бета-тест" },
  { href: "/admin/users", label: "Users", desc: "Пользователи и роли" },
  { href: "/admin/reports", label: "Reports", desc: "Жалобы и модерация" },
  { href: "/admin/achievements", label: "Achievements", desc: "Управление достижениями" },
  { href: "/admin/vfx", label: "VFX", desc: "Каталог визуальных эффектов" },
  { href: "/admin/notifications", label: "Notifications", desc: "Системные рассылки" },
  { href: "/admin/analytics", label: "Analytics", desc: "Метрики платформы" },
  { href: "/admin/activity", label: "Журнал действий", desc: "История admin/moderator действий" },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-100">Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-400">Внутренний кабинет модерации MireaCoin</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900"
            >
              <p className="text-base font-semibold text-slate-100">{section.label}</p>
              <p className="mt-1 text-sm text-slate-400">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
