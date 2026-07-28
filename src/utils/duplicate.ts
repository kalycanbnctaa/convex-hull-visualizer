import { Point } from "../types/Point";
import { EPSILON } from "../algorithms/geometry";

export function removeDuplicatePoints(
  points: Point[],
  epsilon = EPSILON
): Point[] {
  const unique: Point[] = [];

  for (const point of points) {
    const isDuplicate = unique.some(
      (existing) =>
        Math.abs(existing.x - point.x) < epsilon &&
        Math.abs(existing.y - point.y) < epsilon
    );

    if (!isDuplicate) {
      unique.push(point);
    }
  }

  return unique;
}