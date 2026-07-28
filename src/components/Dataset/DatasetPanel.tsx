import { useState } from "react";
import { usePointStore } from "../../store/pointStore";
import { useUIStore } from "../../store/uiStore";
import { useAlgorithmStore } from "../../store/algorithmStore";
import { useToastStore } from "../../store/toastStore";
import { useConfirmStore } from "../../store/confirmStore";
import { generateRandomPoints } from "../../generators/random";
import { generateCirclePoints } from "../../generators/circle";
import { generateRectanglePoints } from "../../generators/rectangle";
import { generateGaussianPoints } from "../../generators/gaussian";
import { generateClusterPoints } from "../../generators/cluster";
import { Point } from "../../types/Point";
import Spinner from "../Common/Spinner";

type DatasetType = "random" | "circle" | "rectangle" | "gaussian" | "cluster";

const DATASET_LABELS: Record<DatasetType, string> = {
  random: "Random",
  circle: "Circle",
  rectangle: "Rectangle",
  gaussian: "Gaussian",
  cluster: "Cluster",
};

export default function DatasetPanel() {
  const [type, setType] = useState<DatasetType>("random");
  const [count, setCount] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);

  const points = usePointStore((state) => state.points);
  const setPoints = usePointStore((state) => state.setPoints);
  const addPoints = usePointStore((state) => state.addPoints);

  const canvasSize = useUIStore((state) => state.canvasSize);
  const closeModal = useUIStore((state) => state.closeModal);

  const clearHull = useAlgorithmStore((state) => state.clearHull);

  const showToast = useToastStore((state) => state.showToast);
  const requestConfirm = useConfirmStore((state) => state.request);

  const handleGenerate = async () => {
    setIsGenerating(true);

    const safeCount = Math.min(1000, Math.max(3, count || 0));

    const options = {
      count: safeCount,
      width: canvasSize.width,
      height: canvasSize.height,
    };

    const generators: Record<DatasetType, () => Point[]> = {
      random: () => generateRandomPoints(options),
      circle: () => generateCirclePoints(options),
      rectangle: () => generateRectanglePoints(options),
      gaussian: () => generateGaussianPoints(options),
      cluster: () => generateClusterPoints(options),
    };

    const newPoints = generators[type]();

    clearHull();

    if (points.length > 0) {
      const append = await requestConfirm(
        "Sudah ada titik di canvas. Tambahkan titik baru, atau ganti seluruhnya?",
        "Tambahkan",
        "Ganti"
      );

      if (append) {
        addPoints(newPoints);
      } else {
        setPoints(newPoints);
      }
    } else {
      setPoints(newPoints);
    }

    showToast(
      `${safeCount} titik berhasil digenerate (${DATASET_LABELS[type]}).`,
      "success"
    );

    setIsGenerating(false);
    closeModal();
  };

  return (
    <div className="dataset-form">
      <div className="form-group">
        <label htmlFor="dataset-type">Jenis Dataset</label>

        <select
          id="dataset-type"
          value={type}
          onChange={(event) => setType(event.target.value as DatasetType)}
        >
          {Object.entries(DATASET_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dataset-count">Jumlah Titik</label>

        <input
          id="dataset-count"
          type="number"
          min={3}
          max={1000}
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />
      </div>

      <button
        className="modal-primary-button"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? <Spinner label="Membuat..." /> : "Generate"}
      </button>
    </div>
  );
}