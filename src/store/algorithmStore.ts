import { create } from "zustand";
import { Point } from "../types/Point";
import { usePointStore } from "./pointStore";
import { useAnimationStore } from "./animationStore";
import { useToastStore } from "./toastStore";
import { grahamScan } from "../algorithms/grahamScan";
import { jarvisMarch } from "../algorithms/jarvisMarch";
import { quickHull } from "../algorithms/quickHull";
import { validatePointsForHull } from "../utils/validation";
import { StepRecorder } from "../animation/StepRecorder";

export type AlgorithmType = "graham" | "jarvis" | "quickhull";

interface RunHullOptions {
  silent?: boolean;
}

interface AlgorithmState {
  algorithm: AlgorithmType;
  hull: Point[] | null;
  error: string | null;
  autoUpdate: boolean;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  setAutoUpdate: (value: boolean) => void;
  runHull: (options?: RunHullOptions) => void;
  clearHull: () => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  algorithm: "graham",
  hull: null,
  error: null,
  autoUpdate: false,

  setAlgorithm: (algorithm) => {
    set({ algorithm, hull: null, error: null });
    useAnimationStore.getState().loadSteps([]);

    if (get().autoUpdate) {
      get().runHull();
    }
  },

  setAutoUpdate: (value) => {
    set({ autoUpdate: value });

    if (value) {
      get().runHull();
    }
  },

  runHull: (options = {}) => {
    const { silent = false } = options;
    const points = usePointStore.getState().points;
    const validation = validatePointsForHull(points);

    if (!validation.valid) {
      const message = validation.message ?? "Titik tidak valid.";

      set({ hull: null, error: message });
      useAnimationStore.getState().loadSteps([]);

      if (!silent) {
        useToastStore.getState().showToast(message, "error");
      }

      return;
    }

    const { algorithm } = get();
    const recorder = new StepRecorder();

    let result: Point[] = [];

    if (algorithm === "graham") {
      result = grahamScan(points, recorder);
    } else if (algorithm === "jarvis") {
      result = jarvisMarch(points, recorder);
    } else if (algorithm === "quickhull") {
      result = quickHull(points, recorder);
    } else {
      const message = `Algoritma "${algorithm}" belum diimplementasikan.`;

      set({ hull: null, error: message });
      useAnimationStore.getState().loadSteps([]);

      if (!silent) {
        useToastStore.getState().showToast(message, "error");
      }

      return;
    }

    set({ hull: result, error: null });
    useAnimationStore.getState().loadSteps(recorder.getSteps());
  },

  clearHull: () => {
    set({ hull: null, error: null });
    useAnimationStore.getState().loadSteps([]);
  },
}));