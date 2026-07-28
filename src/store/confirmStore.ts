import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  resolve: ((value: boolean) => void) | null;
  request: (
    message: string,
    confirmLabel?: string,
    cancelLabel?: string
  ) => Promise<boolean>;
  respond: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  message: "",
  confirmLabel: "OK",
  cancelLabel: "Batal",
  resolve: null,

  request: (message, confirmLabel = "OK", cancelLabel = "Batal") => {
    return new Promise<boolean>((resolve) => {
      set({ isOpen: true, message, confirmLabel, cancelLabel, resolve });
    });
  },

  respond: (value) => {
    const { resolve } = get();

    resolve?.(value);

    set({ isOpen: false, resolve: null });
  },
}));