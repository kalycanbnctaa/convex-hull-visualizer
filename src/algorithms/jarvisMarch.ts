import { Point } from "../types/Point";
import {
  Orientation,
  findPivotPoint,
  orientation,
  distanceSquared,
} from "./geometry";
import { removeDuplicatePoints } from "../utils/duplicate";
import { StepRecorder } from "../animation/StepRecorder";

export function jarvisMarch(points: Point[], recorder?: StepRecorder): Point[] {
  const unique = removeDuplicatePoints(points);

  if (unique.length < 3) return [];

  const start = findPivotPoint(unique);
  const hull: Point[] = [];

  recorder?.record({
    kind: "pivot-selected",
    description: "Memilih titik paling bawah/kiri sebagai titik awal.",
    hullSoFar: [],
    activePoints: [start],
  });

  let current = start;

  do {
    hull.push(current);

    recorder?.record({
      kind: "push",
      description: "Titik ditambahkan ke hull.",
      hullSoFar: [...hull],
      activePoints: [current],
    });

    let candidate = unique.find((point) => point.id !== current.id)!;

    for (const point of unique) {
      if (point.id === current.id || point.id === candidate.id) continue;

      const result = orientation(current, candidate, point);

      recorder?.record({
        kind: "orientation-check",
        description: "Memeriksa apakah titik ini lebih ke luar dibanding kandidat saat ini.",
        hullSoFar: [...hull],
        activePoints: [current],
        candidatePoint: candidate,
        checkedPoint: point,
        orientationResult: result,
      });

      if (result === Orientation.Clockwise) {
        candidate = point;

        recorder?.record({
          kind: "candidate-update",
          description: "Kandidat titik terluar diperbarui.",
          hullSoFar: [...hull],
          activePoints: [current],
          candidatePoint: candidate,
        });
      } else if (result === Orientation.Collinear) {
        const distToCandidate = distanceSquared(current, candidate);
        const distToPoint = distanceSquared(current, point);

        if (distToPoint > distToCandidate) {
          candidate = point;

          recorder?.record({
            kind: "candidate-update",
            description: "Kandidat diperbarui ke titik collinear yang lebih jauh.",
            hullSoFar: [...hull],
            activePoints: [current],
            candidatePoint: candidate,
          });
        }
      }
    }

    current = candidate;
  } while (current.id !== start.id && hull.length <= unique.length);

  recorder?.record({
    kind: "hull-complete",
    description: "Convex Hull selesai dibentuk.",
    hullSoFar: [...hull],
    activePoints: [...hull],
  });

  return hull;
}