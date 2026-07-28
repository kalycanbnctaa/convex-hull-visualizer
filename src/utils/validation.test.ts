import { describe, it, expect } from "vitest";
import { validatePointsForHull } from "./validation";
import { removeDuplicatePoints } from "./duplicate";
import { areAllCollinear } from "./collinear";
import { Point } from "../types/Point";

function p(x: number, y: number, id?: string): Point {
  return { id: id ?? `${x},${y}`, x, y };
}

describe("validatePointsForHull", () => {
  it("rejects an empty point list", () => {
    expect(validatePointsForHull([]).valid).toBe(false);
  });

  it("rejects fewer than 3 points", () => {
    expect(validatePointsForHull([p(0, 0), p(1, 1)]).valid).toBe(false);
  });

  it("rejects points that are all duplicates of each other", () => {
    const result = validatePointsForHull([
      p(1, 1, "a"),
      p(1, 1, "b"),
      p(1, 1, "c"),
    ]);
    expect(result.valid).toBe(false);
  });

  it("rejects points that are all collinear", () => {
    const result = validatePointsForHull([
      p(0, 0),
      p(1, 1),
      p(2, 2),
      p(3, 3),
    ]);
    expect(result.valid).toBe(false);
  });

  it("accepts a valid non-collinear point set", () => {
    expect(validatePointsForHull([p(0, 0), p(2, 0), p(1, 2)]).valid).toBe(
      true
    );
  });

  it("accepts a valid set even with duplicates mixed in", () => {
    const result = validatePointsForHull([
      p(0, 0, "a"),
      p(0, 0, "b"),
      p(2, 0, "c"),
      p(1, 2, "d"),
    ]);
    expect(result.valid).toBe(true);
  });
});

describe("removeDuplicatePoints", () => {
  it("removes points within epsilon distance of each other", () => {
    const points = [p(0, 0, "a"), p(1e-10, 1e-10, "b"), p(5, 5, "c")];
    expect(removeDuplicatePoints(points).length).toBe(2);
  });

  it("keeps distinct points untouched", () => {
    const points = [p(0, 0), p(1, 0), p(0, 1)];
    expect(removeDuplicatePoints(points).length).toBe(3);
  });

  it("returns an empty array when given an empty array", () => {
    expect(removeDuplicatePoints([])).toEqual([]);
  });
});

describe("areAllCollinear", () => {
  it("returns true for fewer than 3 points", () => {
    expect(areAllCollinear([p(0, 0), p(1, 1)])).toBe(true);
    expect(areAllCollinear([p(0, 0)])).toBe(true);
    expect(areAllCollinear([])).toBe(true);
  });

  it("returns true when all points lie on one line", () => {
    expect(areAllCollinear([p(0, 0), p(2, 2), p(4, 4), p(6, 6)])).toBe(true);
  });

  it("returns true for a vertical line", () => {
    expect(areAllCollinear([p(2, 0), p(2, 5), p(2, 10)])).toBe(true);
  });

  it("returns false when at least one point deviates from the line", () => {
    expect(areAllCollinear([p(0, 0), p(2, 2), p(1, 5)])).toBe(false);
  });
});