import { Point } from "../types/Point";

export interface PointRendererOptions {
  radius?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export function drawPoints(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  options: PointRendererOptions = {}
): void {
  const {
    radius = 5,
    fillColor = "#2563eb",
    strokeColor = "#ffffff",
    strokeWidth = 2,
  } = options;

  ctx.save();

  for (const point of points) {
    ctx.beginPath();

    ctx.arc(
      point.x,
      point.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  ctx.restore();
}