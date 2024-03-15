import { IPhigrosChart } from "./chart";

export interface IGame {
  status: EGameStatus;
  chart: IPhigrosChart;
  /** 当前游戏时间 */
  currentTime: number;
  audio: HTMLAudioElement;
}

export enum EGameStatus {
  /** 游戏未开始 */
  NOT_STARTED = "NOT_STARTED",
  /** 游戏进行中 */
  PLAYING = "PLAYING",
  /** 游戏结束 */
  ENDED = "ENDED",
  /** 暂停 */
  PAUSED = "PAUSED",
}

/** [整数拍子数, 向上偏移分子, 向上偏移分母] */
export type IBeat = [number, number, number];
