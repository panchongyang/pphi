import { IBeat } from "./game";
import { ILine } from "./line";

export interface IPhigrosChart {
  id: string;
  author: string;
  music: string;
  lines: ILine[];
  /** bpm 每分钟节拍数 */
  bpm: IBPM[];
  /** 单位毫秒 */
  offset: number;
}

export interface IBPM {
  target: number;
  time: IBeat;
}
