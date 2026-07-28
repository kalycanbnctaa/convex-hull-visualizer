import { Point } from "../types/Point";

type GaussianGeneratorOptions = {
  count: number;
  width: number;
  height: number;
  standardDeviation?: number;
};

export function generateGaussianPoints({
  count,
  width,
  height,
  standardDeviation = 100,
}: GaussianGeneratorOptions): Point[] {
  const points: Point[] = [];

  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < count; i++) {
    points.push({
      id: crypto.randomUUID(),
      x: clamp(
        centerX + randomGaussian() * standardDeviation,
        20,
        width - 20
      ),
      y: clamp(
        centerY + randomGaussian() * standardDeviation,
        20,
        height - 20
      ),
    });
  }

  return points;
}

function randomGaussian(): number {
  let u = 0;
  let v = 0;

  while (u === 0) {
    u = Math.random();
  }

  while (v === 0) {
    v = Math.random();
  }

  return (
    Math.sqrt(-2 * Math.log(u)) *
    Math.cos(2 * Math.PI * v)
  );
}

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, value));
}