import { useEffect, useRef } from "react";
import { usePointStore } from "../store/pointStore";
import { useAlgorithmStore } from "../store/algorithmStore";

const DEBOUNCE_MS = 150;

export function useConvexHull(): void {
  const autoUpdate = useAlgorithmStore((state) => state.autoUpdate);
  const runHull = useAlgorithmStore((state) => state.runHull);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoUpdate) return;

    const unsubscribe = usePointStore.subscribe(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        runHull({ silent: true });
      }, DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoUpdate, runHull]);
}