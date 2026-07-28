import { Point } from "../types/Point";
import {
  Orientation,
  findPivotPoint,
  sortByPolarAngle,
  orientation,
} from "./geometry";
import { removeDuplicatePoints } from "../utils/duplicate";
import { StepRecorder } from "../animation/StepRecorder";

export function grahamScan(points: Point[], recorder?: StepRecorder): Point[] {
  const unique = removeDuplicatePoints(points);

  if (unique.length < 3) return [];

  const pivot = findPivotPoint(unique);

  recorder?.record({
    kind: "pivot-selected",
    description: "Memilih titik pivot (paling bawah/kiri) sebagai titik awal.",
    hullSoFar: [],
    activePoints: [pivot],
  });

  const rest = unique.filter((point) => point.id !== pivot.id);
  const sorted = sortByPolarAngle(pivot, rest);

  recorder?.record({
    kind: "sort-complete",
    description: "Mengurutkan seluruh titik berdasarkan sudut polar terhadap pivot.",
    hullSoFar: [],
    activePoints: [pivot, ...sorted],
  });

  if (sorted.length < 2) return [];

  const stack: Point[] = [pivot, sorted[0]];

  recorder?.record({
    kind: "push",
    description: "Memasukkan pivot dan titik pertama hasil sorting ke stack.",
    hullSoFar: [...stack],
    activePoints: [...stack],
  });

  for (let i = 1; i < sorted.length; i++) {
    let top = stack[stack.length - 1];
    let nextToTop = stack[stack.length - 2];

    let result = orientation(nextToTop, top, sorted[i]);

    recorder?.record({
      kind: "orientation-check",
      description: "Memeriksa orientasi tiga titik teratas untuk menentukan apakah belokan counter-clockwise.",
      hullSoFar: [...stack],
      activePoints: [nextToTop, top],
      checkedPoint: sorted[i],
      orientationResult: result,
    });

    while (stack.length > 1 && result !== Orientation.CounterClockwise) {
      const popped = stack.pop()!;

      recorder?.record({
        kind: "pop",
        description: "Titik dikeluarkan dari stack karena membuat belokan tidak counter-clockwise.",
        hullSoFar: [...stack],
        activePoints: [nextToTop, top, sorted[i]],
        checkedPoint: popped,
      });

      top = stack[stack.length - 1];
      nextToTop = stack[stack.length - 2];

      if (stack.length > 1) {
        result = orientation(nextToTop, top, sorted[i]);

        recorder?.record({
          kind: "orientation-check",
          description: "Memeriksa ulang orientasi setelah titik dikeluarkan dari stack.",
          hullSoFar: [...stack],
          activePoints: [nextToTop, top],
          checkedPoint: sorted[i],
          orientationResult: result,
        });
      }
    }

    stack.push(sorted[i]);

    recorder?.record({
      kind: "push",
      description: "Titik dimasukkan ke stack sebagai bagian dari hull sementara.",
      hullSoFar: [...stack],
      activePoints: [...stack],
      candidatePoint: sorted[i],
    });
  }

  recorder?.record({
    kind: "hull-complete",
    description: "Convex Hull selesai dibentuk.",
    hullSoFar: [...stack],
    activePoints: [...stack],
  });

  return stack;
}