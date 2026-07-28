import { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({
  title,
  onClose,
  children,
  wide = false,
}: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal${wide ? " modal-wide" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}