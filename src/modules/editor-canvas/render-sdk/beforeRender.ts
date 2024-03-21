import { EDITOR_CANVAS_HEIGHT, EDITOR_CANVAS_WIDTH } from "./constans";

export const beforeRender = (ctx: CanvasRenderingContext2D) => {
  //调整坐标系，原点在画布最下方的中心
  ctx.translate(EDITOR_CANVAS_WIDTH / 2, EDITOR_CANVAS_HEIGHT);
  //调整y轴方向，向上为正
  ctx.scale(1, -1);
}