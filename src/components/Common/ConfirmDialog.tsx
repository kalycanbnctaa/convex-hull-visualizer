import { useConfirmStore } from "../../store/confirmStore";

export default function ConfirmDialog() {
  const isOpen = useConfirmStore((state) => state.isOpen);
  const message = useConfirmStore((state) => state.message);
  const confirmLabel = useConfirmStore((state) => state.confirmLabel);
  const cancelLabel = useConfirmStore((state) => state.cancelLabel);
  const respond = useConfirmStore((state) => state.respond);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => respond(false)}>
      <div
        className="modal confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button onClick={() => respond(false)}>{cancelLabel}</button>

          <button
            className="modal-primary-button"
            onClick={() => respond(true)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}