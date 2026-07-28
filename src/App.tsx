import Canvas from "./canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import Modal from "./components/Common/Modal";
import DatasetPanel from "./components/Dataset/DatasetPanel";
import FileUploader from "./components/Dataset/FileUploader";
import BenchmarkPanel from "./components/Benchmark/BenchmarkPanel";
import ToastContainer from "./components/Common/ToastContainer";
import ConfirmDialog from "./components/Common/ConfirmDialog";
import { useUIStore } from "./store/uiStore";
import { useConvexHull } from "./hooks/useConvexHull";

export default function App() {
  useConvexHull();

  const activeModal = useUIStore((state) => state.activeModal);
  const closeModal = useUIStore((state) => state.closeModal);

  return (
    <div className="app">
      <header className="header">
        <h1>Convex Hull Visualizer</h1>

        <p>
          Interactive visualization of Graham Scan, Jarvis March, and
          QuickHull
        </p>
      </header>

      <Toolbar />

      <main className="main">
        <div className="main-content">
          <Canvas />
          <ControlPanel />
        </div>
      </main>

      {activeModal === "dataset" && (
        <Modal title="Generate Dataset" onClose={closeModal}>
          <DatasetPanel />
        </Modal>
      )}

      {activeModal === "import" && (
        <Modal title="Import Dataset" onClose={closeModal}>
          <FileUploader />
        </Modal>
      )}

      {activeModal === "benchmark" && (
        <Modal title="Benchmark Algoritma" onClose={closeModal} wide>
          <BenchmarkPanel />
        </Modal>
      )}

      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
}