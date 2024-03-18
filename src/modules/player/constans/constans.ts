export const standardWidth = 2048;
export const standardHeight = 1400;

//转换坐标，将标准坐标转化为canvas坐标，标准坐标x 取值为 -1024 ～ 1024, y 取值为 -700 ～ 700
export function transformCoordinate(
  x: number,
  y: number,
  context: CanvasRenderingContext2D
) {
  const { width, height } = context.canvas;
  const x1 = (x / standardWidth) * width;
  const y1 = (y / standardHeight) * height;
  return [x1, y1];
}
