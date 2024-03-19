/**
 * 通过背景图片渲染背景
 * 拉伸图片到画布大小
 */
const renderBackground = (
  context: CanvasRenderingContext2D,
  img?: HTMLImageElement
) => {
  const { width, height } = context.canvas;
  if (img) {
    const { width: imgWidth, height: imgHeight } = img;
    const scale = Math.min(width / imgWidth, height / imgHeight);
    context.fillStyle = "rgba(0, 0, 0)";
    context.fillRect(-width / 2, -height / 2, width, height);
    // 加模糊
    context.save();
    context.filter = "blur(24px)";
    //图片上下翻转
    context.scale(1, -1);
    //居中绘制
    context.drawImage(
      img,
      (-imgWidth * scale) / 2,
      (-imgHeight * scale) / 2,
      imgWidth * scale,
      imgHeight * scale
    );
    context.filter = "none";
    context.restore();
  }
  // 加透明黑色幕布，达到降低亮度的效果
  context.fillStyle = "rgba(0, 0, 0, 0.7)";
  context.fillRect(-width / 2, -height / 2, width, height);
};

export default renderBackground;
