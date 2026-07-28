import { useEffect } from "react";
import { useAnimationStore } from "../store/animationStore";

const BASE_INTERVAL_MS = 800;

export function useAnimationController(): void {
  const isPlaying = useAnimationStore((state) => state.isPlaying);
  const speed = useAnimationStore((state) => state.speed);
  const next = useAnimationStore((state) => state.next);
  const steps = useAnimationStore((state) => state.steps);
  const currentStepIndex = useAnimationStore((state) => state.currentStepIndex);

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length - 1) return;

    const interval = setInterval(() => {
      next();
    }, BASE_INTERVAL_MS / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, next, currentStepIndex, steps.length]);
}