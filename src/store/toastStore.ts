import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const TOAST_DURATION_MS = 3500;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message, type = "info") => {
    const id = crypto.randomUUID();

    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

    setTimeout(() => {
      get().dismissToast(id);
    }, TOAST_DURATION_MS);
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));