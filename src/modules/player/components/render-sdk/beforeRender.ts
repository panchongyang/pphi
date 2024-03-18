export function beforeRender(context: CanvasRenderingContext2D) {
  //先把坐标设置在画布中心
  context.translate(context.canvas.width / 2, context.canvas.height / 2);
}
