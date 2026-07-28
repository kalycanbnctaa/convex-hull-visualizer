import { useAnimationStore } from "../../store/animationStore";
import { useAnimationController } from "../../animation/AnimationController";
import SpeedSlider from "./SpeedSlider";

export default function ControlPanel() {
  useAnimationController();

  const steps = useAnimationStore((state) => state.steps);
  const currentStepIndex = useAnimationStore((state) => state.currentStepIndex);
  const isPlaying = useAnimationStore((state) => state.isPlaying);
  const play = useAnimationStore((state) => state.play);
  const pause = useAnimationStore((state) => state.pause);
  const next = useAnimationStore((state) => state.next);
  const previous = useAnimationStore((state) => state.previous);
  const reset = useAnimationStore((state) => state.reset);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="control-panel">
      <div className="control-panel-buttons">
        <button onClick={reset} disabled={currentStepIndex <= 0}>
          Reset
        </button>
        <button onClick={previous} disabled={currentStepIndex <= 0}>
          Previous
        </button>
        {isPlaying ? (
          <button onClick={pause}>Pause</button>
        ) : (
          <button onClick={play} disabled={currentStepIndex >= steps.length - 1}>
            Play
          </button>
        )}
        <button onClick={next} disabled={currentStepIndex >= steps.length - 1}>
          Next
        </button>
      </div>

      <SpeedSlider />

      <div className="step-log">
        <span className="step-log-index">
          Step {currentStepIndex + 1} / {steps.length}
        </span>
        <p className="step-log-description">{currentStep?.description}</p>
      </div>
    </div>
  );
}