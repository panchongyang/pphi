import { EDITOR_CANVAS_HEIGHT, EDITOR_CANVAS_WIDTH } from "./constans";

export function renderback(
  context: CanvasRenderingContext2D,
  img?: HTMLImageElement
) {
  if (img) {
    const { width: imgWidth, height: imgHeight } = img;
    const scale = Math.min(
      EDITOR_CANVAS_WIDTH / imgWidth,
      EDITOR_CANVAS_HEIGHT / imgHeight
    );
    // 加模糊
    context.save();
    context.filter = "blur(48px)";
    //图片上下翻转
    context.scale(1, -1);
    //居中绘制
    context.drawImage(
      img,
      (-imgWidth * scale) / 2,
      -imgHeight * scale,
      imgWidth * scale,
      imgHeight * scale
    );
    context.filter = "none";
    context.restore();
  }
  // 加透明黑色幕布，达到降低亮度的效果
  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(
    -EDITOR_CANVAS_WIDTH / 2,
    0,
    EDITOR_CANVAS_WIDTH,
    EDITOR_CANVAS_HEIGHT
  );
}
