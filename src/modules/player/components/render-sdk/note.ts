import { IGame } from "@/types/game";
import { ENoteType, INote } from "@/types/note";
import { transformCoordinate } from "../../constans/constans";
import { beatToTime } from "@/utils/util";
import { EEventType } from "@/types/event";

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
      const speeds = note.line.events
        .filter((event) => event.type === EEventType.SPEED)
        .map((event, index, arr) => ({
          start: beatToTime(event.startTime, game.chart.bpm),
          end: arr[index + 1]
            ? beatToTime(arr[index + 1].startTime, game.chart.bpm)
            : Infinity,
          value: event.endValue,
        }));
      if (speeds.length === 0) {
        speeds.push({
          start: 0,
          end: Infinity,
          value: note.line.speed,
        });
      }
      const noteTIme = beatToTime(note.time, game.chart.bpm);
      y = speeds.reduce((acc, cur) => {
        if (noteTIme < cur.start) {
          return acc;
        } else if (noteTIme > cur.end) {
          return acc + cur.value * (noteTIme - (cur.end - cur.start)) * 0.1;
        } else if (noteTIme > cur.start && noteTIme < cur.end) {
          return acc + cur.value * (noteTIme - (time - cur.start)) * 0.1;
        } else {
          return acc;
        }
      }, 0);
    }
  }
  const [x1, y1] = transformCoordinate(startX, y, context);
  const [x2, y2] = transformCoordinate(endX, y, context);
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  //天蓝色
  context.strokeStyle = "skyblue";
  context.lineWidth = 4;
  context.stroke();
  context.closePath();
}
