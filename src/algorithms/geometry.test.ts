import { describe, it, expect } from "vitest";
import {
  crossProduct,
  orientation,
  Orientation,
  distance,
  distanceSquared,
  polarAngle,
  findPivotPoint,
  sortByPolarAngle,
  boundingBox,
} from "./geometry";
import { Point } from "../types/Point";

function p(x: number, y: number): Point {
  return { id: `${x},${y}`, x, y };
}

describe("geometry", () => {
  it("computes cross product sign for a CCW turn", () => {
    expect(crossProduct(p(0, 0), p(1, 0), p(1, 1))).toBeGreaterThan(0);
  });

  it("computes cross product sign for a CW turn", () => {
    expect(crossProduct(p(0, 0), p(1, 1), p(1, 0))).toBeLessThan(0);
  });

  it("detects collinear points", () => {
    expect(orientation(p(0, 0), p(1, 1), p(2, 2))).toBe(Orientation.Collinear);
  });

  it("detects counter-clockwise orientation", () => {
    expect(orientation(p(0, 0), p(1, 0), p(1, 1))).toBe(
      Orientation.CounterClockwise
    );
  });

  it("detects clockwise orientation", () => {
    expect(orientation(p(0, 0), p(1, 1), p(1, 0))).toBe(
      Orientation.Clockwise
    );
  });

  it("treats near-zero cross products within epsilon as collinear", () => {
    expect(orientation(p(0, 0), p(10, 0), p(5, 1e-11))).toBe(
      Orientation.Collinear
    );
  });

  it("computes euclidean distance correctly", () => {
    expect(distance(p(0, 0), p(3, 4))).toBe(5);
    expect(distanceSquared(p(0, 0), p(3, 4))).toBe(25);
  });

  it("computes polar angle relative to origin", () => {
    expect(polarAngle(p(0, 0), p(1, 0))).toBeCloseTo(0);
    expect(polarAngle(p(0, 0), p(0, 1))).toBeCloseTo(Math.PI / 2);
  });

  it("finds the bottom-most, then left-most pivot point", () => {
    const points = [p(2, 5), p(0, 5), p(3, 1), p(1, 1)];
    expect(findPivotPoint(points)).toEqual(p(1, 1));
  });

  it("sorts points by non-decreasing polar angle around a pivot", () => {
    const pivot = p(0, 0);
    const points = [p(1, 1), p(1, 0), p(0, 1), p(-1, -1)];
    const sorted = sortByPolarAngle(pivot, points);

    for (let i = 1; i < sorted.length; i++) {
      const prevAngle = polarAngle(pivot, sorted[i - 1]);
      const currAngle = polarAngle(pivot, sorted[i]);
      expect(currAngle).toBeGreaterThanOrEqual(prevAngle - 1e-9);
    }
  });

  it("computes a correct bounding box", () => {
    const points = [p(-2, 3), p(5, -1), p(0, 0)];
    expect(boundingBox(points)).toEqual({
      minX: -2,
      minY: -1,
      maxX: 5,
      maxY: 3,
    });
  });
});