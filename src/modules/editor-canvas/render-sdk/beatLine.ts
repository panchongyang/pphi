import { CanvasEditorConfig, FrameData } from "../hooks/useEditor";
import { EDITOR_CANVAS_HEIGHT, EDITOR_CANVAS_WIDTH, PADDING } from "./constans";
import { getCanvasYFromBeat } from "./utils";

interface BeatLineRenderProps {
  ctx: CanvasRenderingContext2D,
  config: CanvasEditorConfig,
  beatCount: number,
  scroll: {
    scrollY: number;
    scrollHeight: number;
    reactHeight: number;
  },
}

const renderBeatLines = (
  props: BeatLineRenderProps
) => {
  const { ctx, config, beatCount, scroll } = props;
  const { beatHeight, division } = config;
  const beatPositions: FrameData['beats'] = {};
  for (let i = 0; i < beatCount * division; i++) {
    const beatNumber = Math.floor(i / division);
    const beatUp = i % division;
    const beatDown = config.division || 1;
    //beat线和线的节拍数文本总占宽 50%
    ctx.fillStyle = "black";
    //计算beat线的y坐标, 从下往上画，第一条的y为0，向上为正
    const y = getCanvasYFromBeat({
      beatHeight,
      scroll,
      beat: [beatNumber, beatUp, beatDown],
    });
    beatPositions[`${beatNumber}-${beatUp}-${beatDown}`] = y;
    
    //如果在可视区域外，则不画
    if (y > EDITOR_CANVAS_HEIGHT || y < 0) continue;
    //在 - 1 / 2 EDITOR_CANVAS_WIDTH 处画文本，右对齐
    ctx.save();
    ctx.scale(1, -1);
    //绿色 
    ctx.fillStyle = "#00FF00";
    ctx.font = "14px Arial";
    ctx.fillText(
      beatUp === 0 ? beatNumber.toString() : `${beatUp}/${beatDown}`,
      -EDITOR_CANVAS_WIDTH / 2 + 10,
      -y + 5
    );
    ctx.restore();
    //画beat线，文本右边开始，和文本一起不超过宽的50%
    ctx.beginPath();
    ctx.moveTo(-EDITOR_CANVAS_WIDTH / 2 + PADDING, y);
    ctx.lineTo(0 - PADDING, y);
    if (beatUp !== 0) {
      //绿
      ctx.strokeStyle = "green";
    } else {
      //亮绿
      ctx.strokeStyle = "#00FF00";
    }
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return beatPositions;
};

export default renderBeatLines;
