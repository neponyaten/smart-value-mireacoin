"use client";

import { useEffect } from "react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useUIStore } from "@/store/useUIStore";

export default function NotificationsPage() {
  const notifications = useUIStore((s) => s.notifications);
  const unreadCount = useUIStore((s) => s.unreadCount);
  const loadNotifications = useUIStore((s) => s.loadNotifications);
  const markNotificationRead = useUIStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useUIStore((s) => s.markAllNotificationsRead);

  useEffect(() => {
    void loadNotifications(100);
  }, [loadNotifications]);

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <AppTopBar />

        <section className="premium-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Notification Center</p>
              <h1 className="mt-1 text-xl font-semibold text-slate-100">Уведомления</h1>
              <p className="mt-1 text-xs text-slate-400">Непрочитанных: {unreadCount}</p>
            </div>

            <button
              type="button"
              onClick={() => void markAllNotificationsRead()}
              className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Отметить все как прочитанные
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onRead={(id) => {
                    void markNotificationRead(id);
                  }}
                />
              ))
            ) : (
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-6 text-center text-sm text-slate-400">
                Пока нет уведомлений
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
