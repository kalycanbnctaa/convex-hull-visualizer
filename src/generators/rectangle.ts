import { Point } from "../types/Point";

type RectangleGeneratorOptions = {
  count: number;
  width: number;
  height: number;
  padding?: number;
};

export function generateRectanglePoints({
  count,
  width,
  height,
  padding = 40,
}: RectangleGeneratorOptions): Point[] {
  const points: Point[] = [];

  const left = padding;
  const right = width - padding;

  const top = padding;
  const bottom = height - padding;

  const edge = Math.ceil(count / 4);

  for (let i = 0; i < edge && points.length < count; i++) {
    points.push({
      id: crypto.randomUUID(),
      x: left + ((right - left) * i) / edge,
      y: top,
    });
  }

  for (let i = 0; i < edge && points.length < count; i++) {
    points.push({
      id: crypto.randomUUID(),
      x: right,
      y: top + ((bottom - top) * i) / edge,
    });
  }

  for (let i = 0; i < edge && points.length < count; i++) {
    points.push({
      id: crypto.randomUUID(),
      x: right - ((right - left) * i) / edge,
      y: bottom,
    });
  }

  for (let i = 0; i < edge && points.length < count; i++) {
    points.push({
      id: crypto.randomUUID(),
      x: left,
      y: bottom - ((bottom - top) * i) / edge,
    });
  }

  return points;
}