import { IPhigrosChart } from "@/types/chart";
import { useEffect, useRef, useState } from "react";
import { initGame } from "../utils/initgame";
import { EGameStatus } from "@/types/game";

export const usePlayer = (chart: IPhigrosChart, audio: HTMLAudioElement) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const game = useRef(initGame(chart, audio));
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      canvasContext.current = ref.current.getContext("2d");
    }
  }, [chart]);

  const start = () => {
    // 每帧循环绘制
    if (ready) {
      game.current.status = EGameStatus.PLAYING;
      const draw = () => {
        const currentTime = audio.currentTime * 1000;
        if (canvasContext.current) {
          const { width, height } = ref.current!;
          // 清空画布
          canvasContext.current.clearRect(0, 0, width, height);
          // TODO: 绘制游戏内容
        }
        if (game.current.status === EGameStatus.PLAYING) {
          // 继续下一帧
          requestAnimationFrame(draw);
        }
      };
      draw();
    }
  };

  return { ref, start };
};
