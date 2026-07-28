import { Point } from "../types/Point";

type RandomGeneratorOptions = {
  count: number;
  width: number;
  height: number;
  padding?: number;
};

export function generateRandomPoints({
  count,
  width,
  height,
  padding = 30,
}: RandomGeneratorOptions): Point[] {
  const points: Point[] = [];

  for (let i = 0; i < count; i++) {
    points.push({
      id: crypto.randomUUID(),
      x: randomNumber(
        padding,
        width - padding
      ),
      y: randomNumber(
        padding,
        height - padding
      ),
    });
  }

  return points;
}

function randomNumber(
  min: number,
  max: number
): number {
  return (
    Math.random() * (max - min) + min
  );
}