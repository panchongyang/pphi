import { IBPM, IPhigrosChart } from "@/types/chart";
import { useCallback, useEffect, useRef } from "react";
import renderBeatLines from "../render-sdk/beatLine";
import { beforeRender } from "../render-sdk/beforeRender";
import {
  EDITOR_CANVAS_HEIGHT,
  EDITOR_CANVAS_WIDTH,
  PADDING,
} from "../render-sdk/constans";
import { getBeatCount } from "@/utils/util";
import { renderback } from "../render-sdk/background";
import { renderNotes } from "../render-sdk/notes";
import { ILine } from "@/types/line";
import { renderCurrentBeatLine } from "../render-sdk/currentBeatLine";
import { renderCurrentPoint } from "../render-sdk/currentPoint";
import { getMouseBeat, transformXToChartX } from "../render-sdk/utils";
import { ENoteType } from "@/types/note";
import { cloneDeep } from "lodash";

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

type BeatKey = string;

export interface FrameData {
  beats?: Record<BeatKey, number>;
  notes?: Record<BeatKey, number>;
}

export type IMouse = { x: number; y: number };

export function useEditor(
  chart: IPhigrosChart,
  audio: HTMLAudioElement,
  line: ILine,
  onChartChange?: (chart: IPhigrosChart) => void
) {
  const chartRef = useRef(chart);
  const audioRef = useRef(audio);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const configRef = useRef<CanvasEditorConfig>({
    beatHeight: 100,
    division: 4,
    openAnalysis: false,
  });
  const mouse = useRef<IMouse>({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLImageElement>(
    (() => {
      const img = new Image();
      img.src = chartRef.current.background || "";
      return img;
    })()
  );
  const frameData = useRef<FrameData>({});
  const lineRef = useRef<ILine>(line);

  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  useEffect(() => {
    chartRef.current = chart;
  }, [chart]);

  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  const draw = useCallback(
    (context: CanvasRenderingContext2D, scroll: IScroll, beatCount: number) => {
      //TODO: Implement draw function
      renderback(context, background.current);
      const beatPositions = renderBeatLines({
        ctx: context,
        config: configRef.current,
        beatCount,
        scroll,
      });
      renderNotes({
        notes: lineRef.current.notes,
        context,
        scroll,
        config: configRef.current,
      });
      renderCurrentBeatLine(context);
      renderCurrentPoint({
        ctx: context,
        mouse: mouse.current,
        frameData: frameData.current,
      });
      frameData.current.beats = beatPositions;
    },
    []
  );

  const initMouseEvents = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.addEventListener("mousemove", (e) => {
        //获取鼠标在canvas中的坐标
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          mouse.current.x > EDITOR_CANVAS_WIDTH / 2 - PADDING ||
          mouse.current.x < PADDING
        ) {
          return;
        }
        if (e.key === "q" || e.key === 'j' || e.key === 'k' || e.key === 'a' || e.key === 'd') {
          const beat = getMouseBeat(frameData.current, mouse.current);
          const x = transformXToChartX(mouse.current.x);
          if (!beat) return;
          lineRef.current.notes.push({
            type: ENoteType.TAP,
            id: `${lineRef.current.id}-${Math.random()}`,
            time: beat,
            x: x,
          });
          onChartChange?.(cloneDeep(chartRef.current));
        }
        if (e.key === "w") {
          const beat = getMouseBeat(frameData.current, mouse.current);
          const x = transformXToChartX(mouse.current.x);
          if (!beat) return;
          lineRef.current.notes.push({
            type: ENoteType.DRAG,
            id: `${lineRef.current.id}-${Math.random()}`,
            time: beat,
            x: x,
          });
          onChartChange?.(cloneDeep(chartRef.current));
        }
        if (e.key === "e") {
          const beat = getMouseBeat(frameData.current, mouse.current);
          const x = transformXToChartX(mouse.current.x);
          if (!beat) return;
          lineRef.current.notes.push({
            type: ENoteType.FLICK,
            id: `${lineRef.current.id}-${Math.random()}`,
            time: beat,
            x: x,
          });
          onChartChange?.(cloneDeep(chartRef.current));
        }
      };

      window.addEventListener("keydown", handleKeyDown);
    },
    [onChartChange]
  );

  useEffect(() => {
    const scrollEle = scrollRef.current;
    if (!scrollEle) return;
    scrollEle.scrollTop = scrollEle.scrollHeight;
  }, []);

  useEffect(() => {
    //每帧绘制
    if (!canvas.current) return;
    const scrollEle = scrollRef.current;
    if (!scrollEle) return;
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
          (scroll.scrollHeight - EDITOR_CANVAS_HEIGHT);
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
    line: lineRef,
  };
}
