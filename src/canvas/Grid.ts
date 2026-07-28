export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const minor = 25;
  const major = 100;

  ctx.save();

  for (let x = 0; x <= width; x += minor) {
    ctx.beginPath();

    ctx.strokeStyle =
      x % major === 0
        ? "#d1d5db"
        : "#ececec";

    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);

    ctx.stroke();
  }

  for (let y = 0; y <= height; y += minor) {
    ctx.beginPath();

    ctx.strokeStyle =
      y % major === 0
        ? "#d1d5db"
        : "#ececec";

    ctx.moveTo(0, y);
    ctx.lineTo(width, y);

    ctx.stroke();
  }

  ctx.restore();
}