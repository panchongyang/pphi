import { IPhigrosChart } from "@/types/chart";
import { useEffect, useRef, useState } from "react";
import { initGame } from "../utils/initgame";
import { EGameStatus } from "@/types/game";
import renderLine from "../components/render-sdk/line";
import { beforeRender } from "../components/render-sdk/beforeRender";
import renderBackground from "../components/render-sdk/background";

export const usePlayer = (chart: IPhigrosChart, audio: HTMLAudioElement) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const game = useRef(initGame(chart, audio));
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (ref.current) {
      canvasContext.current = ref.current.getContext("2d");
    }
  }, [chart]);

  const start = () => {
    // 每帧循环绘制
    if (ready && canvasContext.current) {
      const context = canvasContext.current;
      audio.play();
      game.current.status = EGameStatus.PLAYING;
      beforeRender(context);
      const draw = () => {
        const currentTime = audio.currentTime * 1000;
        if (canvasContext.current) {
          const { width, height } = ref.current!;
          // 清空画布
          canvasContext.current.clearRect(-width/2, -height/2, width, height);
          // TODO: 绘制游戏内容
          renderBackground(context);
          game.current.chart.lines.forEach((line) => {
            renderLine(context, line, currentTime, game.current);
          });
        }
        if (game.current.status === EGameStatus.PLAYING) {
          // 继续下一帧
          requestAnimationFrame(draw);
        }
      };
      draw();
    }
  };

  return { ref, start, ready };
};
