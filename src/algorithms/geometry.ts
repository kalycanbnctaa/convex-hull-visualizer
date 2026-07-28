import { Point } from "../types/Point";

export const EPSILON = 1e-9;

export enum Orientation {
  Collinear = "collinear",
  Clockwise = "clockwise",
  CounterClockwise = "counterclockwise",
}

export function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

export function orientation(
  p: Point,
  q: Point,
  r: Point,
  epsilon = EPSILON
): Orientation {
  const cross = crossProduct(p, q, r);

  return Math.abs(cross) < epsilon
    ? Orientation.Collinear
    : cross > 0
    ? Orientation.CounterClockwise
    : Orientation.Clockwise;
}

export function distanceSquared(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return dx * dx + dy * dy;
}

export function distance(a: Point, b: Point): number {
  return Math.sqrt(distanceSquared(a, b));
}

export function polarAngle(origin: Point, point: Point): number {
  return Math.atan2(point.y - origin.y, point.x - origin.x);
}

export function findPivotPoint(points: Point[]): Point {
  return points.reduce((lowest, point) => {
    if (
      point.y < lowest.y ||
      (point.y === lowest.y && point.x < lowest.x)
    ) {
      return point;
    }

    return lowest;
  }, points[0]);
}

export function sortByPolarAngle(pivot: Point, points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => {
    const angleA = polarAngle(pivot, a);
    const angleB = polarAngle(pivot, b);

    if (Math.abs(angleA - angleB) < EPSILON) {
      return distanceSquared(pivot, a) - distanceSquared(pivot, b);
    }

    return angleA - angleB;
  });

  return sorted;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function boundingBox(points: Point[]): BoundingBox {
  return points.reduce(
    (box, point) => ({
      minX: Math.min(box.minX, point.x),
      minY: Math.min(box.minY, point.y),
      maxX: Math.max(box.maxX, point.x),
      maxY: Math.max(box.maxY, point.y),
    }),
    {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    }
  );
}