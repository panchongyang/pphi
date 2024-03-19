import { IBPM } from "@/types/chart";
import { EEventType, IEvent } from "@/types/event";
import { IGame } from "@/types/game";
import { ILine } from "@/types/line";
import { beatToTime } from "@/utils/util";
import { transformCoordinate } from "../../constans/constans";
import { renderNote } from "./note";
import { easeMap } from "@/utils/ease";

function renderLine(
  context: CanvasRenderingContext2D,
  line: ILine,
  time: number,
  game: IGame
) {
  //先计算当前帧Line的各个属性
  const { rotation, events } = line;
  //通过当前值和events计算出当前的Line的属性
  events.forEach((event) => {
    const eventStartTime = beatToTime(event.startTime, game.chart.bpm);
    if (time < eventStartTime) {
      return;
    }
    if (event.type === EEventType.X) {
      line.x = getCurrentEventValue(event, time, game.chart.bpm);
    }
    if (event.type === EEventType.Y) {
      line.y = getCurrentEventValue(event, time, game.chart.bpm);
    }
    if (event.type === EEventType.ROTATION) {
      line.rotation = getCurrentEventValue(event, time, game.chart.bpm);
    }
    if (event.type === EEventType.OPACITY) {
      line.opacity = getCurrentEventValue(event, time, game.chart.bpm);
    }
    if (event.type === EEventType.SPEED) {
      line.speed = getCurrentEventValue(event, time, game.chart.bpm);
    }
  });

  //设置画布的旋转角度
  context.save();
  const [x, y] = transformCoordinate(line.x, line.y, context);
  context.translate(x, y);
  const radians = rotation * (Math.PI / 180);
  context.rotate(radians);
  //绘制Line
  context.beginPath();
  context.moveTo(-1000, 0);
  context.lineTo(1000, 0);
  //设置线条样式 金色
  context.strokeStyle = "gold";
  //宽度
  context.lineWidth = 4;
  context.stroke();
  context.closePath();
  //绘制Note
  line.notes.forEach((note) => {
    renderNote(note, time, game, context);
  });
  //结束绘制
  context.restore();
}

export default renderLine;

// 计算当前时间点的值
export function getCurrentEventValue(
  event: IEvent,
  time: number,
  bpm: IBPM[]
): number {
  // 计算时间点在 [0, 1] 范围内的位置
  const t =
    (time - beatToTime(event.startTime, bpm)) /
    (beatToTime(event.endTime, bpm) - beatToTime(event.startTime, bpm));
  if(t > 1) {
    return event.endValue;
  }

  // 使用缓动函数计算当前值
  const easedT = easeMap[event.speed](t);

  // 根据缓动函数的结果计算当前值
  const currentValue =
    event.startValue + (event.endValue - event.startValue) * easedT;

  return currentValue;
}
