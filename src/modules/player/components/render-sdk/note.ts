import { ENoteType } from "@/types/note";
import { transformCoordinate } from "../../constans/constans";
import { EEventType } from "@/types/event";
import { IRuntimeHold, IRuntimeNote } from "@/types/runtime/note";

export function renderNote(
  note: IRuntimeNote,
  time: number,
  context: CanvasRenderingContext2D
) {
  if (isTimeOut(note, time)) return;
  if (note.type === ENoteType.HOLD) {
    renderHoldNote(note, time, context);
  } else {
    renderNormalNote(note, time, context);
  }
}

function renderHoldNote(
  note: IRuntimeHold,
  time: number,
  context: CanvasRenderingContext2D
) {
  const x1 = -60 + note.x;
  const x2 = 60 + note.x;
  const { upY, downY } = getHoldY(note, time);
  //绘制一个矩形, 内部填充颜色, 从x1, upY 到 x2, downY
  context.beginPath();
  const [x11, y11] = transformCoordinate(x1, upY, context);
  const [x12, y12] = transformCoordinate(x2, upY, context);
  const [x21, y21] = transformCoordinate(x2, downY, context);
  const [x22, y22] = transformCoordinate(x1, downY, context);
  context.moveTo(x11, y11);
  context.lineTo(x12, y12);
  context.lineTo(x21, y21);
  context.lineTo(x22, y22);
  context.fillStyle = "skyblue";
  context.fill();
  context.closePath();
}

function renderNormalNote(
  note: Exclude<IRuntimeNote, IRuntimeHold>,
  time: number,
  context: CanvasRenderingContext2D
) {
  //线段长120个标准长度
  context.beginPath();
  const startX = -60 + note.x;
  const endX = 60 + note.x;
  //note的y需要计算，根据时间和bpm计算
  const y = getNoteY(note, time);
  const [x1, y1] = transformCoordinate(startX, y, context);
  const [x2, y2] = transformCoordinate(endX, y, context);
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  switch (note.type) {
    //天蓝色
    case ENoteType.TAP:
      context.strokeStyle = "skyblue";
      break;
    //金色
    case ENoteType.DRAG:
      context.strokeStyle = "gold";
      break;
    case ENoteType.FLICK:
      context.strokeStyle = "red";
      break;
  }
  context.lineWidth = 4;
  context.stroke();
  context.closePath();
}

function getHoldY(
  note: IRuntimeHold,
  time: number
): {
  upY: number;
  downY: number;
} {
  const speeds = note.line.events
    .filter((event) => event.type === EEventType.SPEED)
    .map((event, index, arr) => ({
      start: event.startTime,
      end: arr[index + 1]
        ? arr[index + 1].startTime
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
  const downNoteTime = note.time;
  const upNoteTime = note.duration;
  const downY = speeds.reduce((acc, cur) => {
    if (downNoteTime < cur.start) {
      return acc;
    } else if (downNoteTime > cur.end) {
      return acc + cur.value * (downNoteTime - (cur.end - cur.start)) * 0.1;
    } else if (downNoteTime > cur.start && downNoteTime < cur.end) {
      if (time > downNoteTime && time < upNoteTime) {
        return 0;
      } else {
        return acc + cur.value * (downNoteTime - (time - cur.start)) * 0.1;
      }
    } else {
      return acc;
    }
  }, 0);

  const upY = speeds.reduce((acc, cur) => {
    const overlap = getOverlap(
      [cur.start, cur.end],
      [downNoteTime, upNoteTime]
    );
    const finishTime = time - downNoteTime > 0 ? time - downNoteTime : 0;
    if (overlap.length === 0) {
      return acc - finishTime * cur.value * 0.1;
    } else {
      return (
        acc +
        cur.value * (overlap[1] - overlap[0]) * 0.1 -
        finishTime * cur.value * 0.1
      );
    }
  }, downY);

  return {
    downY,
    upY,
  };
}

//获取note的y坐标
function getNoteY(note: IRuntimeNote, time: number) {
  let y = 0;
  const speeds = note.line.events
    .filter((event) => event.type === EEventType.SPEED)
    .map((event, index, arr) => ({
      start: event.startTime,
      end: arr[index + 1]
        ? arr[index + 1].startTime
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
  const noteTIme = note.time;
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

  return y;
}

//判断是否超时
function isTimeOut(note: IRuntimeNote, time: number) {
  return note.type === ENoteType.HOLD ? note.duration < time : note.time < time;
}

//获取两个数字元组重叠的区间
function getOverlap([a, b]: [number, number], [c, d]: [number, number]) {
  const [start, end] = [Math.max(a, c), Math.min(b, d)];
  return start < end ? [start, end] : [];
}
