import { BOTTOM_PADDING, EDITOR_CANVAS_WIDTH, PADDING } from "./constans";

export function renderCurrentBeatLine(
  ctx: CanvasRenderingContext2D,
) {
  ctx.save();
  ctx.strokeStyle = "gold";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(- EDITOR_CANVAS_WIDTH / 2 + PADDING, BOTTOM_PADDING);
  ctx.lineTo(0 - PADDING, BOTTOM_PADDING);
  ctx.stroke();
  ctx.restore();
}