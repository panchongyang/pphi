import { IPhigrosChart } from "@/types/chart";
import { useCallback, useEffect, useRef, useState } from "react";
import { initGame } from "../utils/initgame";
import { EGameStatus, IGame } from "@/types/runtime/game";
import renderLine from "../components/render-sdk/line";
import { beforeRender } from "../components/render-sdk/beforeRender";
import renderBackground from "../components/render-sdk/background";
import { ENoteStatus } from "@/types/runtime/note";

export const usePlayer = (chart: IPhigrosChart, audio?: HTMLAudioElement) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{ game: IGame | null }>({ game: null });
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ref.current && audio) {
      canvasContext.current = ref.current.getContext("2d");
      audio.volume = 0.2;
      gameRef.current.game = initGame(
        chart,
        audio,
        gameRef.current.game?.status
      );
      setReady(true);
    }
  }, [chart, audio]);

  const draw = useCallback((context: CanvasRenderingContext2D) => {
    const game = gameRef.current.game!;
    const currentTime = game.audio.currentTime * 1000 + chart.offset;
    if (canvasContext.current) {
      const { width, height } = ref.current!;
      // 清空画布
      canvasContext.current.clearRect(-width / 2, -height / 2, width, height);
      // 绘制背景
      renderBackground(context, game.background);
      // 内容绘制
      game.chart.lines.forEach((line) => {
        renderLine(context, line, currentTime);
      });
    }
    if (
      game.status === EGameStatus.PLAYING ||
      game.status === EGameStatus.PAUSED
    ) {
      // 继续下一帧
      requestAnimationFrame(() => {
        draw(context);
      });
    }
  }, [chart.offset]);

  const start = useCallback(() => {
    // 每帧循环绘制
    if (ready && canvasContext.current && gameRef.current.game) {
      const context = canvasContext.current;
      context.resetTransform();
      context.reset();
      const game = gameRef.current.game;
      game.chart.lines.forEach((line) => {
        line.notes.forEach((note) => {
          note.status = ENoteStatus.NOT_STARTED;
        });
      });
      game.audio.currentTime = 0;
      game.audio.play();
      game.status = EGameStatus.PLAYING;
      beforeRender(context);

      draw(context);
    }
  }, [draw, ready]);

  const pause = () => {
    if (gameRef.current.game) {
      gameRef.current.game.status = EGameStatus.PAUSED;
      gameRef.current.game.audio.pause();
    }
  };

  const continueGame = () => {
    if (gameRef.current.game) {
      gameRef.current.game.status = EGameStatus.PLAYING;
      gameRef.current.game.audio.play();
      draw(canvasContext.current!);
    }
  };

  useEffect(() => {
    if (audio) {
      //当音频被用户改变进度时，设置note的状态为未开始
      audio.addEventListener("seeked", () => {
        if (gameRef.current.game) {
          gameRef.current.game.chart.lines.forEach((line) => {
            line.notes.forEach((note) => {
              //设置晚于音乐时间的note为未开始
              if (note.time > audio!.currentTime * 1000) {
                note.status = ENoteStatus.NOT_STARTED;
              }
            });
          });
        }
      });
      //当音频播放时，使用start
      audio.addEventListener("play", () => {
        console.log("control by audio play event");
        if (audio?.currentTime === 0) {
          start();
        }
      });
    }

    return () => {
      if (audio) {
        audio.removeEventListener("seeked", () => {});
        audio.removeEventListener("play", () => {});
      }
    };
  }, [audio, start]);

  return { ref, start, ready, pause, continueGame };
};
