import { IBeat } from "./game";

export interface IEvent {
  id: string;
  startTime: IBeat;
  endTime: IBeat;
  /** 速度变化曲线 */
  speed: string;
  /** 事件类型 */
  type: EEventType;
  startValue: number;
  endValue: number;
}

export enum EEventType {
  /** 透明度 */
  OPACITY = "OPACITY",
  /** 位置 */
  X = "X",
  Y = "Y",
  /** 旋转 */
  ROTATION = "ROTATION",
  /** 流速 */
  SPEED = "SPEED",
}
