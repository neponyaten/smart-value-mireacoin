import { apiClient } from "@/lib/api/client";
import type { NotificationItem, ToastItem, UITheme } from "@/lib/types/domain";
import { create } from "zustand";

const THEME_STORAGE_KEY = "mireacoin-theme";

function applyThemeToDom(theme: UITheme) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-theme", theme);
}

type UIState = {
  theme: UITheme;
  notifications: NotificationItem[];
  unreadCount: number;
  toastQueue: ToastItem[];

  hydrateTheme: () => void;
  setTheme: (theme: UITheme) => void;
  toggleTheme: () => void;

  loadNotifications: (limit?: number) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  pushToast: (payload: Omit<ToastItem, "id" | "createdAt"> & { id?: string }) => void;
  removeToast: (toastId: string) => void;
};

export const useUIStore = create<UIState>((set, get) => ({
  theme: "dark",
  notifications: [],
  unreadCount: 0,
  toastQueue: [],

  hydrateTheme: () => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const theme: UITheme = stored === "light" ? "light" : "dark";
    applyThemeToDom(theme);
    set({ theme });
  },

  setTheme: (theme) => {
    applyThemeToDom(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: UITheme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(nextTheme);
  },

  loadNotifications: async (limit = 30) => {
    try {
      const { items, unreadCount } = await apiClient.getNotifications(limit);
      set({ notifications: items, unreadCount });
    } catch {
      set({ notifications: [], unreadCount: 0 });
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      await apiClient.markNotificationRead(notificationId);
      set((state) => {
        const target = state.notifications.find((item) => item.id === notificationId);
        const delta = target && !target.isRead ? 1 : 0;
        return {
          notifications: state.notifications.map((item) =>
            item.id === notificationId ? { ...item, isRead: true } : item
          ),
          unreadCount: Math.max(0, state.unreadCount - delta),
        };
      });
    } catch {
      // Keep UI stable when notification API is temporarily unavailable.
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await apiClient.markAllNotificationsRead();
      set((state) => ({
        notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // Keep UI stable when notification API is temporarily unavailable.
    }
  },

  pushToast: (payload) => {
    const id = payload.id || `toast-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    set((state) => ({
      toastQueue: [...state.toastQueue, { ...payload, id, createdAt }],
    }));
  },

  removeToast: (toastId) => {
    set((state) => ({
      toastQueue: state.toastQueue.filter((item) => item.id !== toastId),
    }));
  },
}));
