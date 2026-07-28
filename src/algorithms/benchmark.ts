import { Point } from "../types/Point";
import { grahamScan } from "./grahamScan";
import { jarvisMarch } from "./jarvisMarch";
import { quickHull } from "./quickHull";
import { generateRandomPoints } from "../generators/random";
import { BenchmarkResult } from "../types/Benchmark";
import { validatePointsForHull } from "../utils/validation";

export type BenchmarkAlgorithm = "graham" | "jarvis" | "quickhull";

const ALGORITHMS: Record<BenchmarkAlgorithm, (points: Point[]) => Point[]> = {
  graham: grahamScan,
  jarvis: jarvisMarch,
  quickhull: quickHull,
};

export const ALGORITHM_LABELS: Record<BenchmarkAlgorithm, string> = {
  graham: "Graham Scan",
  jarvis: "Jarvis March",
  quickhull: "QuickHull",
};

export function runSingleBenchmark(
  algorithm: BenchmarkAlgorithm,
  points: Point[]
): BenchmarkResult {
  const validation = validatePointsForHull(points);

  if (!validation.valid) {
    return {
      algorithm,
      pointCount: points.length,
      timeMs: 0,
      hullSize: 0,
    };
  }

  const fn = ALGORITHMS[algorithm];

  const start = performance.now();
  const hull = fn(points);
  const end = performance.now();

  return {
    algorithm,
    pointCount: points.length,
    timeMs: end - start,
    hullSize: hull.length,
  };
}

export function runBenchmarkSuite(
  algorithms: BenchmarkAlgorithm[],
  sizes: number[],
  canvasWidth: number,
  canvasHeight: number
): BenchmarkResult[] {
  const results: BenchmarkResult[] = [];

  const width = canvasWidth > 0 ? canvasWidth : 800;
  const height = canvasHeight > 0 ? canvasHeight : 600;

  const validSizes = sizes.filter((size) => size >= 3);

  for (const size of validSizes) {
    const points = generateRandomPoints({
      count: size,
      width,
      height,
    });

    for (const algorithm of algorithms) {
      results.push(runSingleBenchmark(algorithm, points));
    }
  }

  return results;
}