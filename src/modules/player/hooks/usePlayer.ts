import { IPhigrosChart } from "@/types/chart";
import { useEffect, useRef, useState } from "react";
import { initGame } from "../utils/initgame";
import { EGameStatus, IGame } from "@/types/runtime/game";
import renderLine from "../components/render-sdk/line";
import { beforeRender } from "../components/render-sdk/beforeRender";
import renderBackground from "../components/render-sdk/background";

export const usePlayer = (chart: IPhigrosChart, audio: HTMLAudioElement) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{ game: IGame | null }>({ game: null });
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      canvasContext.current = ref.current.getContext("2d");
      gameRef.current.game = initGame(chart, audio);
      setReady(true);
    }
  }, [audio, chart]);

  const draw = (context: CanvasRenderingContext2D, game: IGame) => {
    const currentTime = audio.currentTime * 1000;
    if (canvasContext.current) {
      const { width, height } = ref.current!;
      // 清空画布
      canvasContext.current.clearRect(
        -width / 2,
        -height / 2,
        width,
        height
      );
      // 绘制背景
      renderBackground(context);
      // 内容绘制
      game.chart.lines.forEach((line) => {
        renderLine(context, line, currentTime);
      });
    }
    if (game.status === EGameStatus.PLAYING) {
      // 继续下一帧
      requestAnimationFrame(() => {
        draw(context, game);
      });
    }
  };
  const start = () => {
    // 每帧循环绘制
    if (ready && canvasContext.current && gameRef.current.game) {
      const context = canvasContext.current;
      const game = gameRef.current.game;
      audio.play();
      game.status = EGameStatus.PLAYING;
      beforeRender(context);
     
      draw(context, game);
    }
  };

  const pause = () => {
    if (gameRef.current.game) {
      gameRef.current.game.status = EGameStatus.PAUSED;
      audio.pause();
    }
  }

  const continueGame = () => {
    if (gameRef.current.game) {
      gameRef.current.game.status = EGameStatus.PLAYING;
      audio.play();
      draw(canvasContext.current!, gameRef.current.game);
    }
  }

  return { ref, start, ready, pause, continueGame };
};
