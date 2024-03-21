import { IPhigrosChart } from "@/types/chart";
import { useCallback, useEffect, useRef } from "react";
import renderBeatLines from "../render-sdk/beatLine";
import { beforeRender } from "../render-sdk/beforeRender";
import {
  EDITOR_CANVAS_HEIGHT,
  EDITOR_CANVAS_WIDTH,
} from "../render-sdk/constans";
import { getBeatCount } from "@/utils/util";

export interface CanvasEditorConfig {
  beatHeight: number;
  division: number;
  openAnalysis: boolean;
}

export interface IScroll {
  scrollY: number;
  scrollHeight: number;
  reactHeight: number;
}

export function useEditor(chart: IPhigrosChart, audio: HTMLAudioElement) {
  const chartRef = useRef(chart);
  const audioRef = useRef(audio);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const configRef = useRef<CanvasEditorConfig>({
    beatHeight: 100,
    division: 4,
    openAnalysis: false,
  });
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  const draw = useCallback(
    (context: CanvasRenderingContext2D, scroll: IScroll, beatCount: number) => {
      //TODO: Implement draw function
      renderBeatLines(context, configRef.current, beatCount, scroll);
    },
    []
  );

  const initMouseEvents = useCallback((canvas: HTMLCanvasElement) => {
    canvas.addEventListener("mousemove", (e) => {
      //获取鼠标在canvas中的坐标
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    });
  }, []);

  useEffect(() => {
    //每帧绘制
    if (!canvas.current) return;
    const scrollEle = scrollRef.current;
    if (!scrollEle) return;
    scrollEle.scrollTop = scrollEle.scrollHeight;
    const context = canvas.current.getContext("2d");
    if (!context) return;

    initMouseEvents(canvas.current);

    let animationContext: number;
    beforeRender(context);
    const beatCount = getBeatCount(
      audioRef.current.duration * 1000,
      chartRef.current.bpm
    );

    const update = () => {
      //清除画布
      context.clearRect(
        -EDITOR_CANVAS_WIDTH / 2,
        0,
        EDITOR_CANVAS_WIDTH,
        EDITOR_CANVAS_HEIGHT
      );
      const scroll: IScroll = {
        scrollY: scrollEle.scrollTop,
        scrollHeight: scrollEle.scrollHeight,
        reactHeight: scrollEle.clientHeight,
      };
      //如果音频正在播放，调整滚动条
      if (!audioRef.current.paused) {
        scrollEle.scrollTop =
          (1 - audioRef.current.currentTime / audioRef.current.duration) *
          (scroll.scrollHeight - EDITOR_CANVAS_WIDTH);
      }
      draw(context, scroll, beatCount);
      animationContext = requestAnimationFrame(update);
    };
    animationContext = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationContext);
      context.resetTransform();
      context.reset();
    };
  }, [draw, initMouseEvents]);

  return {
    canvas: canvas,
    config: configRef.current,
    scrollRef,
  };
}
