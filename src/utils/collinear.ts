import { Point } from "../types/Point";
import { orientation, Orientation } from "../algorithms/geometry";

export function areAllCollinear(points: Point[]): boolean {
  if (points.length < 3) return true;

  const [p0, p1] = points;

  return points
    .slice(2)
    .every((point) => orientation(p0, p1, point) === Orientation.Collinear);
}