import { Point } from "../types/Point";

type CircleGeneratorOptions = {
  count: number;
  width: number;
  height: number;
  radius?: number;
};

export function generateCirclePoints({
  count,
  width,
  height,
  radius,
}: CircleGeneratorOptions): Point[] {
  const points: Point[] = [];

  const centerX = width / 2;
  const centerY = height / 2;

  const r =
    radius ??
    Math.min(width, height) * 0.35;

  for (let i = 0; i < count; i++) {
    const angle =
      (2 * Math.PI * i) / count;

    points.push({
      id: crypto.randomUUID(),
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    });
  }

  return points;
}