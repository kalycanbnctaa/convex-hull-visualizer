import { describe, it, expect } from "vitest";
import { grahamScan } from "./grahamScan";
import { jarvisMarch } from "./jarvisMarch";
import { quickHull } from "./quickHull";
import { validatePointsForHull } from "../utils/validation";
import { Point } from "../types/Point";

function p(x: number, y: number, id?: string): Point {
  return { id: id ?? `${x},${y}`, x, y };
}

const ALGORITHMS: [string, (points: Point[]) => Point[]][] = [
  ["Graham Scan", grahamScan],
  ["Jarvis March", jarvisMarch],
  ["QuickHull", quickHull],
];

describe.each(ALGORITHMS)("%s edge cases", (_name, algorithm) => {
  it("returns an empty hull for fewer than 3 points", () => {
    expect(algorithm([p(0, 0), p(1, 1)])).toEqual([]);
    expect(algorithm([p(0, 0)])).toEqual([]);
    expect(algorithm([])).toEqual([]);
  });

  it("does not crash on duplicate points", () => {
    const points = [
      p(0, 0, "a"),
      p(0, 0, "b"),
      p(0, 0, "c"),
      p(5, 0, "d"),
      p(2, 5, "e"),
    ];
    expect(() => algorithm(points)).not.toThrow();
  });

  it("does not crash or hang on fully collinear points", () => {
    const points = [p(0, 0), p(1, 1), p(2, 2), p(3, 3), p(4, 4)];
    expect(() => algorithm(points)).not.toThrow();
  });

  it("does not crash when every point is identical", () => {
    const points = [p(3, 3, "a"), p(3, 3, "b"), p(3, 3, "c"), p(3, 3, "d")];
    expect(() => algorithm(points)).not.toThrow();
  });

  it("produces a hull whose points are a subset of the input", () => {
    const points = [p(0, 0), p(4, 0), p(4, 4), p(0, 4), p(2, 2)];
    const hull = algorithm(points);
    const inputIds = new Set(points.map((point) => point.id));

    for (const hullPoint of hull) {
      expect(inputIds.has(hullPoint.id)).toBe(true);
    }
  });

  it("produces the correct hull for a square with an interior point", () => {
    const points = [p(0, 0), p(4, 0), p(4, 4), p(0, 4), p(2, 2)];
    const hull = algorithm(points);
    const hullIds = hull.map((point) => point.id).sort();

    expect(hullIds).toEqual(
      [p(0, 0).id, p(4, 0).id, p(4, 4).id, p(0, 4).id].sort()
    );
  });

  it("produces the correct hull for a triangle", () => {
    const points = [p(0, 0), p(6, 0), p(3, 6)];
    const hull = algorithm(points);
    const hullIds = hull.map((point) => point.id).sort();

    expect(hullIds).toEqual([p(0, 0).id, p(6, 0).id, p(3, 6).id].sort());
  });
});

describe("full pipeline: validation agrees with algorithm behavior on invalid datasets", () => {
  it("flags every invalid dataset as invalid before any algorithm would run", () => {
    const invalidSets: Point[][] = [
      [],
      [p(0, 0)],
      [p(0, 0), p(1, 1)],
      [p(0, 0), p(1, 1), p(2, 2)],
      [p(1, 1, "a"), p(1, 1, "b"), p(1, 1, "c")],
    ];

    for (const points of invalidSets) {
      expect(validatePointsForHull(points).valid).toBe(false);
    }
  });
});