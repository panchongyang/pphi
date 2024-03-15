import { IBeat } from "./game";
import { ILine } from "./line";

export interface Note {
  id: string;
  line: ILine;
  type: ENoteType;
  /** 判定时间节点，[整数拍子数, 向上偏移分子, 向上偏移分母] */
  time: IBeat;
  /** 位置 */
  x: number;
}

enum ENoteType {
  TAP = "TAP",
  HOLD = "HOLD",
  DRAG = "DRAG",
  FLICK = "FLICK",
}

export interface INoteTap extends Note {
  type: ENoteType.TAP;
}

export interface INoteHold extends Note {
  type: ENoteType.HOLD;
  /** 结束时间节点，[整数拍子数, 向上偏移分子, 向上偏移分母] */
  duration: IBeat;
}

export interface INoteDrag extends Note {
  type: ENoteType.DRAG;
}

export interface INoteFlick extends Note {
  type: ENoteType.FLICK;
}

export type INote = INoteTap | INoteHold | INoteDrag | INoteFlick;
