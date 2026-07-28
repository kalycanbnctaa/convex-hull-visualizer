import { useToastStore } from "../../store/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>

          <button
            className="toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Tutup notifikasi"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}