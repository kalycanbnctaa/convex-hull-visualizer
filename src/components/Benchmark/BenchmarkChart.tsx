import { BenchmarkResult } from "../../types/Benchmark";
import { ALGORITHM_LABELS, BenchmarkAlgorithm } from "../../algorithms/benchmark";

interface BenchmarkChartProps {
  results: BenchmarkResult[];
}

const ALGORITHM_COLORS: Record<BenchmarkAlgorithm, string> = {
  graham: "#2563eb",
  jarvis: "#f97316",
  quickhull: "#22c55e",
};

export default function BenchmarkChart({ results }: BenchmarkChartProps) {
  if (results.length === 0) return null;

  const maxTime = Math.max(...results.map((result) => result.timeMs), 1);

  const sizes = Array.from(
    new Set(results.map((result) => result.pointCount))
  ).sort((a, b) => a - b);

  const algorithms = Array.from(
    new Set(results.map((result) => result.algorithm))
  ) as BenchmarkAlgorithm[];

  return (
    <div className="benchmark-chart">
      <div className="benchmark-chart-legend">
        {algorithms.map((algorithm) => (
          <span key={algorithm} className="benchmark-legend-item">
            <span
              className="benchmark-legend-swatch"
              style={{ background: ALGORITHM_COLORS[algorithm] ?? "#888" }}
            />
            {ALGORITHM_LABELS[algorithm] ?? algorithm}
          </span>
        ))}
      </div>

      <div className="benchmark-chart-bars">
        {sizes.map((size) => (
          <div key={size} className="benchmark-chart-group">
            <div className="benchmark-chart-group-bars">
              {algorithms.map((algorithm) => {
                const result = results.find(
                  (item) =>
                    item.pointCount === size && item.algorithm === algorithm
                );

                const height = result ? (result.timeMs / maxTime) * 160 : 0;

                return (
                  <div
                    key={algorithm}
                    className="benchmark-bar"
                    style={{
                      height: `${height}px`,
                      background: ALGORITHM_COLORS[algorithm] ?? "#888",
                    }}
                    title={`${ALGORITHM_LABELS[algorithm] ?? algorithm}: ${
                      result ? result.timeMs.toFixed(3) : "0"
                    } ms`}
                  />
                );
              })}
            </div>

            <span className="benchmark-chart-label">{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}