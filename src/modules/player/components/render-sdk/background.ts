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
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const dx = (width - imgWidth * scale) / 2;
    const dy = (height - imgHeight * scale) / 2;
    // 加模糊
    context.filter = "blur(2px)";
    context.drawImage(img, dx, dy, imgWidth * scale, imgHeight * scale);
    context.filter = "none";
  }
  // 加透明黑色幕布，达到降低亮度的效果
  context.fillStyle = "rgba(0, 0, 0, 0.3)";
  context.fillRect(-width / 2, -height / 2, width, height);
};

export default renderBackground;
