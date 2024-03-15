import { IPhigrosChart } from "@/types/chart";
import { EGameStatus, IGame } from "@/types/game";

export function initGame(chart: IPhigrosChart, audio: HTMLAudioElement): IGame {
  return {
    status: EGameStatus.NOT_STARTED,
    chart,
    currentTime: 0,
    audio,
  };
}
