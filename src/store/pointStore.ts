import { create } from "zustand";
import { Point } from "../types/Point";

interface PointState {
  points: Point[];
  addPoint: (point: Point) => void;
  addPoints: (points: Point[]) => void;
  removePoint: (x: number, y: number, radius?: number) => void;
  movePoint: (id: string, x: number, y: number) => void;
  findPoint: (x: number, y: number, radius?: number) => Point | undefined;
  getPointById: (id: string) => Point | undefined;
  setPoints: (points: Point[]) => void;
  clearPoints: () => void;
}

export const usePointStore = create<PointState>((set, get) => ({
  points: [],

  addPoint: (point) =>
    set((state) => ({ points: [...state.points, point] })),

  addPoints: (newPoints) =>
    set((state) => ({ points: [...state.points, ...newPoints] })),

  removePoint: (x, y, radius = 8) =>
    set((state) => ({
      points: state.points.filter((point) => {
        const dx = point.x - x;
        const dy = point.y - y;
        return Math.sqrt(dx * dx + dy * dy) > radius;
      }),
    })),

  movePoint: (id, x, y) =>
    set((state) => ({
      points: state.points.map((point) =>
        point.id === id ? { ...point, x, y } : point
      ),
    })),

  findPoint: (x, y, radius = 8) => {
    const { points } = get();

    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i];
      const dx = point.x - x;
      const dy = point.y - y;

      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return point;
      }
    }

    return undefined;
  },

  getPointById: (id) => get().points.find((point) => point.id === id),

  setPoints: (points) => set({ points }),

  clearPoints: () => set({ points: [] }),
}));