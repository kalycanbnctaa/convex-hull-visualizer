import { RefObject, useEffect, useState } from "react";

interface CanvasSize {
  width: number;
  height: number;
}

interface UseCanvasResult {
  size: CanvasSize;
  context: CanvasRenderingContext2D | null;
}

export default function useCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>
): UseCanvasResult {
  const [size, setSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
  });

  const [context, setContext] =
    useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      setSize({ width, height });
      setContext(ctx);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef]);

  return {
    size,
    context,
  };
}