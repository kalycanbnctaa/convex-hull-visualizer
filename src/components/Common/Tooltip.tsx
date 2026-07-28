import { ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && <span className="tooltip-bubble">{content}</span>}
    </span>
  );
}