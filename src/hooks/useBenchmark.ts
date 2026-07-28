import { useCallback, useState } from "react";
import { BenchmarkResult } from "../types/Benchmark";
import { BenchmarkAlgorithm, runBenchmarkSuite } from "../algorithms/benchmark";
import { useUIStore } from "../store/uiStore";

const DEFAULT_SIZES = [10, 50, 100, 500, 1000, 2000];

interface UseBenchmarkResult {
  results: BenchmarkResult[];
  isRunning: boolean;
  runBenchmark: (algorithms: BenchmarkAlgorithm[], sizes?: number[]) => void;
  clearResults: () => void;
}

export function useBenchmark(): UseBenchmarkResult {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const canvasSize = useUIStore((state) => state.canvasSize);

  const runBenchmark = useCallback(
    (algorithms: BenchmarkAlgorithm[], sizes: number[] = DEFAULT_SIZES) => {
      if (algorithms.length === 0) return;

      setIsRunning(true);

      setTimeout(() => {
        const suiteResults = runBenchmarkSuite(
          algorithms,
          sizes,
          canvasSize.width,
          canvasSize.height
        );

        setResults(suiteResults);
        setIsRunning(false);
      }, 50);
    },
    [canvasSize]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { results, isRunning, runBenchmark, clearResults };
}