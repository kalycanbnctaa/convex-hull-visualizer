import { useState } from "react";
import { useBenchmark } from "../../hooks/useBenchmark";
import BenchmarkTable from "./BenchmarkTable";
import BenchmarkChart from "./BenchmarkChart";
import {
  ALGORITHM_LABELS,
  BenchmarkAlgorithm,
} from "../../algorithms/benchmark";
import Spinner from "../Common/Spinner";

const SIZE_PRESETS = [10, 50, 100, 500, 1000, 2000];

const ALL_ALGORITHMS: BenchmarkAlgorithm[] = ["graham", "jarvis", "quickhull"];

export default function BenchmarkPanel() {
  const { results, isRunning, runBenchmark, clearResults } = useBenchmark();

  const [selectedAlgorithms, setSelectedAlgorithms] =
    useState<BenchmarkAlgorithm[]>(ALL_ALGORITHMS);

  const toggleAlgorithm = (algorithm: BenchmarkAlgorithm) => {
    setSelectedAlgorithms((previous) =>
      previous.includes(algorithm)
        ? previous.filter((item) => item !== algorithm)
        : [...previous, algorithm]
    );
  };

  const handleRun = () => {
    runBenchmark(selectedAlgorithms, SIZE_PRESETS);
  };

  return (
    <div className="benchmark-panel">
      <div className="benchmark-controls">
        <div className="benchmark-algorithm-toggles">
          {ALL_ALGORITHMS.map((algorithm) => (
            <label key={algorithm} className="benchmark-checkbox">
              <input
                type="checkbox"
                checked={selectedAlgorithms.includes(algorithm)}
                onChange={() => toggleAlgorithm(algorithm)}
              />
              {ALGORITHM_LABELS[algorithm]}
            </label>
          ))}
        </div>

        <div className="benchmark-actions">
          <button
            className="modal-primary-button"
            onClick={handleRun}
            disabled={isRunning || selectedAlgorithms.length === 0}
          >
            {isRunning ? <Spinner label="Menjalankan..." /> : "Jalankan Benchmark"}
          </button>

          <button
            onClick={clearResults}
            disabled={isRunning || results.length === 0}
          >
            Bersihkan
          </button>
        </div>
      </div>

      {isRunning && (
        <p className="benchmark-status">
          Menjalankan benchmark untuk {SIZE_PRESETS.length} ukuran dataset...
        </p>
      )}

      <BenchmarkChart results={results} />
      <BenchmarkTable results={results} />
    </div>
  );
}