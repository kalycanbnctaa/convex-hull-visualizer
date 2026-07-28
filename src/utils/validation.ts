import { Point } from "../types/Point";
import { removeDuplicatePoints } from "./duplicate";
import { areAllCollinear } from "./collinear";

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validatePointsForHull(points: Point[]): ValidationResult {
  if (points.length < 3) {
    return {
      valid: false,
      message: "Minimal 3 titik diperlukan untuk membentuk Convex Hull.",
    };
  }

  const unique = removeDuplicatePoints(points);

  if (unique.length < 3) {
    return {
      valid: false,
      message: "Jumlah titik unik kurang dari 3 setelah menghapus duplikat.",
    };
  }

  if (areAllCollinear(unique)) {
    return {
      valid: false,
      message: "Seluruh titik berada pada satu garis lurus (collinear).",
    };
  }

  return { valid: true };
}