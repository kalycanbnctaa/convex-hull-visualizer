import { Point } from "../types/Point";

export function parsePointsFile(content: string): Point[] {
  const lines = content.split(/\r?\n/);
  const points: Point[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    const parts = trimmed.split(",");

    if (parts.length !== 2) continue;

    const x = Number(parts[0].trim());
    const y = Number(parts[1].trim());

    if (Number.isNaN(x) || Number.isNaN(y)) continue;

    points.push({
      id: crypto.randomUUID(),
      x,
      y,
    });
  }

  return points;
}