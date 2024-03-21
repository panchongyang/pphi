import { FrameData, IMouse } from "../hooks/useEditor";
import { EDITOR_CANVAS_WIDTH } from "./constans";
import { getMouseBeat } from "./utils";

interface IRenderCurrentPointProps {
  ctx: CanvasRenderingContext2D;
  mouse: IMouse;
  frameData: FrameData;
}

export function renderCurrentPoint(props: IRenderCurrentPointProps) {
  const { ctx, mouse, frameData } = props;
  if(mouse.x > EDITOR_CANVAS_WIDTH / 2) return
  //找到离鼠标y轴最近的beat线
  let beatKey = "";
  const beats = frameData.beats;
  if (!beats) return;
  const mouseBeat = getMouseBeat(frameData, mouse);
  if(!mouseBeat) return
  const [beatNumber, beatUp, beatDown] = mouseBeat;
  beatKey = `${beatNumber}-${beatUp}-${beatDown}`;

  //const [beatNumber, beatUp, beatDown] = beatKey.split("-").map(Number);
  const y = beats[beatKey];
  const lineLong = 20;
  ctx.save();
  ctx.strokeStyle = "gold";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(mouse.x - lineLong / 2 - EDITOR_CANVAS_WIDTH / 2, y);
  ctx.lineTo(mouse.x + lineLong / 2 - EDITOR_CANVAS_WIDTH / 2, y);
  ctx.stroke();
}
