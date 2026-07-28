import { BenchmarkResult } from "../../types/Benchmark";
import { ALGORITHM_LABELS } from "../../algorithms/benchmark";

interface BenchmarkTableProps {
  results: BenchmarkResult[];
}

export default function BenchmarkTable({ results }: BenchmarkTableProps) {
  if (results.length === 0) {
    return <p className="benchmark-empty">Belum ada hasil benchmark.</p>;
  }

  return (
    <table className="benchmark-table">
      <thead>
        <tr>
          <th>Algoritma</th>
          <th>Jumlah Titik</th>
          <th>Waktu (ms)</th>
          <th>Titik Hull</th>
        </tr>
      </thead>

      <tbody>
        {results.map((result, index) => (
          <tr key={`${result.algorithm}-${result.pointCount}-${index}`}>
            <td>
              {ALGORITHM_LABELS[
                result.algorithm as keyof typeof ALGORITHM_LABELS
              ] ?? result.algorithm}
            </td>
            <td>{result.pointCount}</td>
            <td>{result.timeMs.toFixed(3)}</td>
            <td>{result.hullSize}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}