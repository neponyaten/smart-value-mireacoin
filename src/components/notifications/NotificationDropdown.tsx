"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useUIStore } from "@/store/useUIStore";
import { NotificationItem } from "@/components/notifications/NotificationItem";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 320 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const notifications = useUIStore((s) => s.notifications);
  const unreadCount = useUIStore((s) => s.unreadCount);
  const loadNotifications = useUIStore((s) => s.loadNotifications);
  const markNotificationRead = useUIStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useUIStore((s) => s.markAllNotificationsRead);

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const width = Math.min(360, Math.max(280, window.innerWidth - 24));
    const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
    const top = rect.bottom + 10;

    setPosition({ top, left, width });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void loadNotifications(20);
    const timer = setInterval(() => void loadNotifications(20), 25_000);
    return () => clearInterval(timer);
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const onWindowChange = () => updatePosition();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("resize", onWindowChange);
      window.removeEventListener("scroll", onWindowChange, true);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/20 bg-slate-900/60 text-cyan-100 transition hover:border-cyan-300/45 hover:shadow-[0_0_18px_rgba(34,211,238,0.22)]"
        aria-label="Уведомления"
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full border border-cyan-200/30 bg-cyan-300 px-1 text-center text-[10px] font-semibold text-slate-950">
            {Math.min(unreadCount, 99)}
          </span>
        ) : null}
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={panelRef}
                  key="notifications-dropdown"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="fixed z-[120] rounded-2xl border border-cyan-200/20 bg-slate-950/95 p-3 shadow-[0_18px_42px_rgba(2,8,24,0.55)] backdrop-blur-xl"
                  style={{ top: position.top, left: position.left, width: position.width }}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">Уведомления</h3>
                    <button
                      type="button"
                      className="text-[11px] text-cyan-200 transition hover:text-cyan-100"
                      onClick={() => void markAllNotificationsRead()}
                    >
                      Прочитать все
                    </button>
                  </div>

                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 7).map((item) => (
                        <NotificationItem
                          key={item.id}
                          item={item}
                          onRead={(id) => {
                            void markNotificationRead(id);
                          }}
                        />
                      ))
                    ) : (
                      <p className="rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-4 text-center text-xs text-slate-400">
                        Пока пусто
                      </p>
                    )}
                  </div>

                  <Link
                    href="/app/notifications"
                    onClick={() => setOpen(false)}
                    className="mt-2 block rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-center text-xs text-cyan-100 transition hover:bg-cyan-300/15"
                  >
                    Открыть центр уведомлений
                  </Link>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
