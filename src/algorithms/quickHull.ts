import { Point } from "../types/Point";
import {
  crossProduct,
  distance,
  findPivotPoint,
  sortByPolarAngle,
} from "./geometry";
import { removeDuplicatePoints } from "../utils/duplicate";
import { StepRecorder } from "../animation/StepRecorder";

function pointLineDistance(a: Point, b: Point, p: Point): number {
  const cross = crossProduct(a, b, p);
  const base = distance(a, b);

  return base === 0 ? 0 : Math.abs(cross) / base;
}

function findExtremePoints(points: Point[]): [Point, Point] {
  let leftmost = points[0];
  let rightmost = points[0];

  for (const point of points) {
    if (
      point.x < leftmost.x ||
      (point.x === leftmost.x && point.y < leftmost.y)
    ) {
      leftmost = point;
    }

    if (
      point.x > rightmost.x ||
      (point.x === rightmost.x && point.y > rightmost.y)
    ) {
      rightmost = point;
    }
  }

  return [leftmost, rightmost];
}

function findSide(a: Point, b: Point, p: Point): number {
  return crossProduct(a, b, p);
}

function sortedSnapshot(hull: Set<Point>): Point[] {
  const arr = Array.from(hull);

  if (arr.length < 3) return arr;

  const pivot = findPivotPoint(arr);
  const rest = arr.filter((point) => point.id !== pivot.id);

  return [pivot, ...sortByPolarAngle(pivot, rest)];
}

function findHullSide(
  points: Point[],
  a: Point,
  b: Point,
  side: number,
  hull: Set<Point>,
  recorder?: StepRecorder
): void {
  let farthest: Point | null = null;
  let maxDistance = 0;

  const candidates = points.filter(
    (point) => Math.sign(findSide(a, b, point)) === Math.sign(side)
  );

  recorder?.record({
    kind: "partition",
    description: "Membagi titik ke satu sisi garis untuk dicari titik terjauh.",
    hullSoFar: sortedSnapshot(hull),
    activePoints: [a, b, ...candidates],
  });

  for (const point of candidates) {
    const d = pointLineDistance(a, b, point);

    if (d > maxDistance) {
      maxDistance = d;
      farthest = point;
    }
  }

  if (!farthest) {
    return;
  }

  hull.add(farthest);

  recorder?.record({
    kind: "farthest-point-found",
    description: "Titik terjauh dari garis ditemukan, ditambahkan ke hull.",
    hullSoFar: sortedSnapshot(hull),
    activePoints: [a, b],
    candidatePoint: farthest,
  });

  recorder?.record({
    kind: "recurse",
    description: "Melakukan rekursi ke dua sub-region baru yang dibentuk oleh titik terjauh.",
    hullSoFar: sortedSnapshot(hull),
    activePoints: [a, farthest, b],
  });

  findHullSide(
    candidates,
    a,
    farthest,
    -findSide(a, farthest, b),
    hull,
    recorder
  );

  findHullSide(
    candidates,
    farthest,
    b,
    -findSide(farthest, b, a),
    hull,
    recorder
  );
}

export function quickHull(points: Point[], recorder?: StepRecorder): Point[] {
  const unique = removeDuplicatePoints(points);

  if (unique.length < 3) return [];

  const [leftmost, rightmost] = findExtremePoints(unique);

  recorder?.record({
    kind: "extreme-points-selected",
    description: "Memilih titik paling kiri dan paling kanan sebagai basis pembagian pertama.",
    hullSoFar: [],
    activePoints: [leftmost, rightmost],
  });

  if (leftmost.id === rightmost.id) {
    return [leftmost];
  }

  const hull = new Set<Point>([leftmost, rightmost]);

  findHullSide(unique, leftmost, rightmost, 1, hull, recorder);
  findHullSide(unique, rightmost, leftmost, 1, hull, recorder);

  const unordered = Array.from(hull);
  const pivot = findPivotPoint(unordered);
  const rest = unordered.filter((point) => point.id !== pivot.id);
  const ordered = [pivot, ...sortByPolarAngle(pivot, rest)];

  recorder?.record({
    kind: "sort-complete",
    description: "Mengurutkan titik-titik hull yang ditemukan berdasarkan sudut polar agar membentuk poligon yang benar.",
    hullSoFar: ordered,
    activePoints: ordered,
  });

  recorder?.record({
    kind: "hull-complete",
    description: "Convex Hull selesai dibentuk.",
    hullSoFar: ordered,
    activePoints: ordered,
  });

  return ordered;
}