import { Point } from "../types/Point";

type ClusterGeneratorOptions = {
  count: number;
  width: number;
  height: number;
  clusters?: number;
  clusterRadius?: number;
};

export function generateClusterPoints({
  count,
  width,
  height,
  clusters = 4,
  clusterRadius = 60,
}: ClusterGeneratorOptions): Point[] {
  const points: Point[] = [];

  const centers = Array.from(
    { length: clusters },
    () => ({
      x:
        Math.random() * (width - 120) + 60,
      y:
        Math.random() * (height - 120) + 60,
    })
  );

  for (let i = 0; i < count; i++) {
    const center =
      centers[
        Math.floor(Math.random() * clusters)
      ];

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      Math.random() * clusterRadius;

    points.push({
      id: crypto.randomUUID(),
      x:
        center.x +
        Math.cos(angle) * distance,
      y:
        center.y +
        Math.sin(angle) * distance,
    });
  }

  return points;
}