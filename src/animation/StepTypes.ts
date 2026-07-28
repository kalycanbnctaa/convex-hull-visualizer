import { Point } from "../types/Point";
import { Orientation } from "../algorithms/geometry";

export type StepKind =
  | "pivot-selected"
  | "sort-complete"
  | "orientation-check"
  | "push"
  | "pop"
  | "candidate-update"
  | "hull-complete"
  | "extreme-points-selected"
  | "partition"
  | "farthest-point-found"
  | "recurse";

export interface AlgorithmStep {
  kind: StepKind;
  description: string;
  hullSoFar: Point[];
  activePoints: Point[];
  candidatePoint?: Point;
  checkedPoint?: Point;
  orientationResult?: Orientation;
}