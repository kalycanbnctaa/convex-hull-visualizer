import { create } from "zustand";

type ModalType = "dataset" | "import" | "benchmark" | null;

interface CanvasSize {
  width: number;
  height: number;
}

interface UIState {
  canvasSize: CanvasSize;
  setCanvasSize: (size: CanvasSize) => void;
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  canvasSize: { width: 0, height: 0 },
  setCanvasSize: (size) => set({ canvasSize: size }),
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));