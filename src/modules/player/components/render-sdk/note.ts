import { IGame } from "@/types/game";
import { ENoteType, INote } from "@/types/note";
import { transformCoordinate } from "../../constans/constans";
import { beatToTime } from "@/utils/util";

export function renderNote(
  note: INote,
  time: number,
  game: IGame,
  context: CanvasRenderingContext2D
) {
  //先直接在原点绘制一个线段，线段中点是原点
  //线段长120个标准长度
  context.beginPath();
  const startX = -60 + note.x;
  const endX = 60 + note.x;
  //note的y需要计算，根据时间和bpm计算
  let y = 0;
  if (note.type !== ENoteType.HOLD) {
    const noteTime = beatToTime(note.time, game.chart.bpm);
    if (time > noteTime) {
      return;
    } else {
      y = (noteTime - time) * 0.5;
    }
  }
  const [x1, y1] = transformCoordinate(startX, y, context);
  const [x2, y2] = transformCoordinate(endX, y, context);
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  //金色
  context.strokeStyle = "gold";
  context.lineWidth = 4;
  context.stroke();
  context.closePath();
}
