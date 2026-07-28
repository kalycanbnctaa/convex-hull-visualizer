import { Point } from "../types/Point";

export interface HullRendererOptions {
  strokeColor?: string;
  strokeWidth?: number;
  pointColor?: string;
  pointRadius?: number;
  pointStrokeColor?: string;
}

export function drawHull(
  ctx: CanvasRenderingContext2D,
  hullPoints: Point[],
  options: HullRendererOptions = {}
): void {
  if (hullPoints.length < 2) return;

  const {
    strokeColor = "#f97316",
    strokeWidth = 2,
    pointColor = "#f97316",
    pointRadius = 6,
    pointStrokeColor = "#ffffff",
  } = options;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(hullPoints[0].x, hullPoints[0].y);

  for (let i = 1; i < hullPoints.length; i++) {
    ctx.lineTo(hullPoints[i].x, hullPoints[i].y);
  }

  ctx.closePath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  for (const point of hullPoints) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);

    ctx.fillStyle = pointColor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = pointStrokeColor;
    ctx.stroke();
  }

  ctx.restore();
}