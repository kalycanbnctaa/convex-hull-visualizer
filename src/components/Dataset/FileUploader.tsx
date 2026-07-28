import { ChangeEvent, useState } from "react";
import { usePointStore } from "../../store/pointStore";
import { useUIStore } from "../../store/uiStore";
import { useAlgorithmStore } from "../../store/algorithmStore";
import { useToastStore } from "../../store/toastStore";
import { useConfirmStore } from "../../store/confirmStore";
import { parsePointsFile } from "../../services/fileParser";
import Spinner from "../Common/Spinner";

export default function FileUploader() {
  const [isImporting, setIsImporting] = useState(false);

  const points = usePointStore((state) => state.points);
  const setPoints = usePointStore((state) => state.setPoints);
  const addPoints = usePointStore((state) => state.addPoints);

  const closeModal = useUIStore((state) => state.closeModal);

  const clearHull = useAlgorithmStore((state) => state.clearHull);

  const showToast = useToastStore((state) => state.showToast);
  const requestConfirm = useConfirmStore((state) => state.request);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsImporting(true);

    const text = await file.text();
    const parsed = parsePointsFile(text);

    if (parsed.length === 0) {
      showToast("File tidak berisi titik yang valid.", "error");
      event.target.value = "";
      setIsImporting(false);
      return;
    }

    clearHull();

    if (points.length > 0) {
      const append = await requestConfirm(
        "Sudah ada titik di canvas. Tambahkan titik dari file, atau ganti seluruhnya?",
        "Tambahkan",
        "Ganti"
      );

      if (append) {
        addPoints(parsed);
      } else {
        setPoints(parsed);
      }
    } else {
      setPoints(parsed);
    }

    showToast(`${parsed.length} titik berhasil diimpor dari ${file.name}.`, "success");

    event.target.value = "";
    setIsImporting(false);
    closeModal();
  };

  return (
    <div className="file-uploader">
      <p>Pilih file .txt atau .csv dengan format "x,y" per baris.</p>

      <input
        type="file"
        accept=".txt,.csv"
        onChange={handleFileChange}
        disabled={isImporting}
      />

      {isImporting && <Spinner label="Mengimpor file..." />}
    </div>
  );
}