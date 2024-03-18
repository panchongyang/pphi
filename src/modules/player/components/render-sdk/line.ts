import { IBPM } from "@/types/chart";
import { EEventType, IEvent } from "@/types/event";
import { IGame } from "@/types/game";
import { ILine } from "@/types/line";
import { beatToTime } from "@/utils/util";
import { transformCoordinate } from "../../constans/constans";

function renderLine(
  context: CanvasRenderingContext2D,
  line: ILine,
  time: number,
  game: IGame
) {
  //先计算当前帧Line的各个属性
  const {rotation, events } = line;
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
  //TODO: 绘制Line上的Note
  //结束绘制
  context.restore();
}

export default renderLine;

const getCurrentEventValue = (event: IEvent, time: number, bpm: IBPM[]) => {
  //TODO: 支持非线形变化
  const eventStartTime = beatToTime(event.startTime, bpm);
  const eventEndTime = beatToTime(event.endTime, bpm);
  if (time > eventEndTime) {
    return event.endValue;
  }
  return (
    event.startValue +
    ((event.endValue - event.startValue) * (time - eventStartTime)) /
      (eventEndTime - eventStartTime)
  );
};
