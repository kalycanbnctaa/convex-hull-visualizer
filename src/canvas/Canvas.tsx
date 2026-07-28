import { MouseEvent, useEffect, useRef, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import { drawGrid } from "./Grid";
import { drawPoints } from "./PointRenderer";
import { drawHull } from "./HullRenderer";
import { drawHighlights } from "./HighlightRenderer";
import { usePointStore } from "../store/pointStore";
import { useUIStore } from "../store/uiStore";
import { useAlgorithmStore } from "../store/algorithmStore";
import { useAnimationStore } from "../store/animationStore";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { size, context } = useCanvas(canvasRef);

  const points = usePointStore((state) => state.points);
  const addPoint = usePointStore((state) => state.addPoint);
  const removePoint = usePointStore((state) => state.removePoint);
  const movePoint = usePointStore((state) => state.movePoint);
  const findPoint = usePointStore((state) => state.findPoint);

  const setCanvasSize = useUIStore((state) => state.setCanvasSize);

  const hullError = useAlgorithmStore((state) => state.error);

  const steps = useAnimationStore((state) => state.steps);
  const currentStepIndex = useAnimationStore((state) => state.currentStepIndex);
  const currentStep = steps[currentStepIndex] ?? null;

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [didSelectExisting, setDidSelectExisting] = useState(false);

  useEffect(() => {
    setCanvasSize(size);
  }, [size, setCanvasSize]);

  useEffect(() => {
    if (!context) return;

    context.clearRect(0, 0, size.width, size.height);

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size.width, size.height);

    drawGrid(context, size.width, size.height);

    drawPoints(context, points);

    if (currentStep) {
      if (currentStep.hullSoFar.length > 0) {
        drawHull(context, currentStep.hullSoFar);
      }

      drawHighlights(
        context,
        currentStep.activePoints,
        currentStep.candidatePoint,
        currentStep.checkedPoint
      );
    }
  }, [context, size, points, currentStep]);

  const getMousePosition = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePosition(event);

    const selected = findPoint(x, y);

    if (!selected) {
      setDidSelectExisting(false);
      return;
    }

    setDraggingId(selected.id);
    setIsDragging(false);
    setDidSelectExisting(true);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePosition(event);

    setMouse({ x: Math.round(x), y: Math.round(y) });

    if (!draggingId) return;

    setIsDragging(true);

    movePoint(draggingId, x, y);
  };

  const handleMouseUp = () => {
    setDraggingId(null);

    requestAnimationFrame(() => {
      setIsDragging(false);
    });
  };

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    if (isDragging || didSelectExisting) {
      setDidSelectExisting(false);
      return;
    }

    const { x, y } = getMousePosition(event);

    addPoint({
      id: crypto.randomUUID(),
      x,
      y,
    });
  };

  const handleRightClick = (event: MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const { x, y } = getMousePosition(event);

    removePoint(x, y);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas"
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="canvas-status">
        <span>Points : {points.length}</span>
        <span>
          Cursor : ({mouse.x}, {mouse.y})
        </span>
        {hullError && <span className="canvas-error">{hullError}</span>}
        {currentStep && !hullError && (
          <span>Hull Points : {currentStep.hullSoFar.length}</span>
        )}
      </div>
    </div>
  );
}