import { create } from "zustand";
import { AlgorithmStep } from "../animation/StepTypes";

interface AnimationState {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  loadSteps: (steps: AlgorithmStep[]) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 1,

  loadSteps: (steps) =>
    set({
      steps,
      currentStepIndex: steps.length > 0 ? steps.length - 1 : -1,
      isPlaying: false,
    }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  next: () => {
    const { steps, currentStepIndex } = get();

    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  previous: () => {
    const { currentStepIndex } = get();

    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  reset: () => set({ currentStepIndex: 0, isPlaying: false }),

  setSpeed: (speed) => set({ speed }),
}));