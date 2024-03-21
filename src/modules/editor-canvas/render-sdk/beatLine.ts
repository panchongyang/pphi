import { CanvasEditorConfig } from "../hooks/useEditor";
import { EDITOR_CANVAS_HEIGHT, EDITOR_CANVAS_WIDTH } from "./constans";

const renderBeatLines = (
  ctx: CanvasRenderingContext2D,
  config: CanvasEditorConfig,
  beatCount: number,
  scroll: {
    scrollY: number;
    scrollHeight: number;
    reactHeight: number;
  }
) => {
  const { beatHeight, division } = config;
  const beatLineHeight = beatHeight / division;
  for (let i = 0; i < beatCount * division; i++) {
    const beatNumber = Math.floor(i / division) + 1;
    const beatUp = i % division;
    const beatDown = config.division || 1;
    //beat线和线的节拍数文本总占宽 50%
    ctx.fillStyle = "black";
    //计算beat线的y坐标, 从下往上画，第一条的y为0，向上为正
    const y =
      beatLineHeight * i -
      (scroll.scrollHeight - EDITOR_CANVAS_HEIGHT - scroll.scrollY - beatLineHeight);
    //如果在可视区域外，则不画
    if (y > EDITOR_CANVAS_HEIGHT || y < 0) continue;
    //在 - 1 / 2 EDITOR_CANVAS_WIDTH 处画文本，右对齐
    ctx.save();
    ctx.scale(1, -1);
    ctx.fillText(
      beatUp === 0 ? beatNumber.toString() : `${beatUp}/${beatDown}`,
      -EDITOR_CANVAS_WIDTH / 2 + 10,
      -y
    );
    ctx.restore();
    //画beat线，文本右边开始，和文本一起不超过宽的50%
    ctx.beginPath();
    ctx.moveTo(-EDITOR_CANVAS_WIDTH / 2 + 36, y);
    ctx.lineTo(EDITOR_CANVAS_WIDTH / 2, y);
    if (beatUp !== 0) {
      //浅灰
      ctx.strokeStyle = "#f0f0f0";
    } else {
      //黑色
      ctx.strokeStyle = "black";
    }
    ctx.lineWidth = 1;
    ctx.stroke();
  }
};

export default renderBeatLines;
