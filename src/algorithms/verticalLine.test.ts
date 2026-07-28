import { describe, it, expect } from "vitest";
import { grahamScan } from "./grahamScan";
import { jarvisMarch } from "./jarvisMarch";
import { quickHull } from "./quickHull";
import { Point } from "../types/Point";

function p(x: number, y: number, id?: string): Point {
  return { id: id ?? `${x},${y}`, x, y };
}

const ALGORITHMS: [string, (points: Point[]) => Point[]][] = [
  ["Graham Scan", grahamScan],
  ["Jarvis March", jarvisMarch],
  ["QuickHull", quickHull],
];

describe.each(ALGORITHMS)("%s on a vertical line of points", (_name, algorithm) => {
  it("does not crash", () => {
    const points = [p(2, 0), p(2, 5), p(2, 10)];
    expect(() => algorithm(points)).not.toThrow();
  });

  it("returns the two endpoints of the segment, not a single point", () => {
    const points = [p(2, 0), p(2, 5), p(2, 10)];
    const hull = algorithm(points);
    const hullIds = new Set(hull.map((point) => point.id));

    expect(hull.length).toBeGreaterThanOrEqual(2);
    expect(hullIds.has(p(2, 0).id)).toBe(true);
    expect(hullIds.has(p(2, 10).id)).toBe(true);
  });
});

describe.each(ALGORITHMS)("%s on a horizontal line of points", (_name, algorithm) => {
  it("returns the two endpoints of the segment", () => {
    const points = [p(0, 3), p(5, 3), p(10, 3)];
    const hull = algorithm(points);
    const hullIds = new Set(hull.map((point) => point.id));

    expect(hull.length).toBeGreaterThanOrEqual(2);
    expect(hullIds.has(p(0, 3).id)).toBe(true);
    expect(hullIds.has(p(10, 3).id)).toBe(true);
  });
});