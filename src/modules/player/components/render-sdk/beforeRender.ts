export function beforeRender(context: CanvasRenderingContext2D) {
  //先把坐标设置在画布中心
  context.translate(context.canvas.width / 2, context.canvas.height / 2);
  //所有Y轴的值都取反
  context.scale(1, -1);
}
