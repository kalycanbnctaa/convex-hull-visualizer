import { useAnimationStore } from "../../store/animationStore";

export default function SpeedSlider() {
  const speed = useAnimationStore((state) => state.speed);
  const setSpeed = useAnimationStore((state) => state.setSpeed);

  return (
    <div className="speed-slider">
      <label htmlFor="speed">Kecepatan: {speed.toFixed(1)}x</label>
      <input
        id="speed"
        type="range"
        min={0.5}
        max={4}
        step={0.5}
        value={speed}
        onChange={(event) => setSpeed(Number(event.target.value))}
      />
    </div>
  );
}