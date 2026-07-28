import { Point } from "../types/Point";

export interface HighlightOptions {
  activeColor?: string;
  candidateColor?: string;
  checkedColor?: string;
  radius?: number;
}

export function drawHighlights(
  ctx: CanvasRenderingContext2D,
  activePoints: Point[],
  candidatePoint: Point | undefined,
  checkedPoint: Point | undefined,
  options: HighlightOptions = {}
): void {
  const {
    activeColor = "#facc15",
    candidateColor = "#22c55e",
    checkedColor = "#ef4444",
    radius = 8,
  } = options;

  ctx.save();

  for (const point of activePoints) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  if (candidatePoint) {
    ctx.beginPath();
    ctx.arc(candidatePoint.x, candidatePoint.y, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = candidateColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  if (checkedPoint) {
    ctx.beginPath();
    ctx.arc(checkedPoint.x, checkedPoint.y, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = checkedColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.restore();
}