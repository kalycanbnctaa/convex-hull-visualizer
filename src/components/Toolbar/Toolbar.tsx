import {
  Shuffle,
  Upload,
  Trash2,
  Play,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import { usePointStore } from "../../store/pointStore";
import { useUIStore } from "../../store/uiStore";
import { useAlgorithmStore, AlgorithmType } from "../../store/algorithmStore";
import Tooltip from "../Common/Tooltip";

export default function Toolbar() {
  const clearPoints = usePointStore((state) => state.clearPoints);
  const openModal = useUIStore((state) => state.openModal);

  const algorithm = useAlgorithmStore((state) => state.algorithm);
  const setAlgorithm = useAlgorithmStore((state) => state.setAlgorithm);
  const runHull = useAlgorithmStore((state) => state.runHull);
  const clearHull = useAlgorithmStore((state) => state.clearHull);
  const autoUpdate = useAlgorithmStore((state) => state.autoUpdate);
  const setAutoUpdate = useAlgorithmStore((state) => state.setAutoUpdate);

  const handleClear = () => {
    clearPoints();
    clearHull();
  };

  const handleResetApp = () => {
    clearPoints();
    clearHull();
    setAlgorithm("graham");
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Tooltip content="Pilih algoritma Convex Hull yang ingin digunakan">
          <select
            value={algorithm}
            onChange={(event) =>
              setAlgorithm(event.target.value as AlgorithmType)
            }
          >
            <option value="graham">Graham Scan</option>
            <option value="jarvis">Jarvis March</option>
            <option value="quickhull">QuickHull</option>
          </select>
        </Tooltip>

        <Tooltip content="Hull otomatis diperbarui saat titik ditambah atau digeser">
          <label className="dynamic-toggle">
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={(event) => setAutoUpdate(event.target.checked)}
            />
            Dynamic Hull
          </label>
        </Tooltip>
      </div>

      <div className="toolbar-right">
        <Tooltip content="Generate titik secara acak atau berdasarkan pola tertentu">
          <button onClick={() => openModal("dataset")}>
            <Shuffle size={16} />
            Random
          </button>
        </Tooltip>

        <Tooltip content="Import titik dari file .txt atau .csv">
          <button onClick={() => openModal("import")}>
            <Upload size={16} />
            Import
          </button>
        </Tooltip>

        <Tooltip content="Hapus semua titik di canvas">
          <button onClick={handleClear}>
            <Trash2 size={16} />
            Clear
          </button>
        </Tooltip>

        <Tooltip content="Jalankan algoritma dan hitung Convex Hull">
          <button onClick={runHull}>
            <Play size={16} />
            Run
          </button>
        </Tooltip>

        <Tooltip content="Reset seluruh aplikasi ke kondisi awal">
          <button onClick={handleResetApp}>
            <RotateCcw size={16} />
            Reset App
          </button>
        </Tooltip>

        <Tooltip content="Bandingkan performa antar algoritma">
          <button onClick={() => openModal("benchmark")}>
            <BarChart3 size={16} />
            Benchmark
          </button>
        </Tooltip>
      </div>
    </div>
  );
}