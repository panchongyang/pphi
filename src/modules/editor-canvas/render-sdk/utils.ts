import { IBeat } from "@/types/beat";
import { FrameData, IMouse, IScroll } from "../hooks/useEditor";
import {
  BOTTOM_PADDING,
  EDITOR_CANVAS_HEIGHT,
  EDITOR_CANVAS_WIDTH,
  PADDING,
} from "./constans";

interface getCanvasYProps {
  beatHeight: number;
  scroll: IScroll;
  beat: IBeat;
}

export function getCanvasYFromBeat(props: getCanvasYProps) {
  const { beatHeight, scroll, beat } = props;
  const [beatNumber, beatUp, beatDown] = beat;
  const beatLineHeight = beatHeight / beatDown;
  return (
    beatHeight * beatNumber +
    beatLineHeight * beatUp -
    (scroll.scrollHeight - EDITOR_CANVAS_HEIGHT - scroll.scrollY) +
    BOTTOM_PADDING
  );
}

/**
 * 将x转化为canvas坐标系的x， x取值 -1024 ~ 1024
 * canvas坐标系的x取值 -0.5 * EDITOR_CANVAS_WIDTH + PADDING ~ 0 - PADDING
 */
export function transformX(x: number) {
  return ((x + 1024) / 2048) * (0.5 * EDITOR_CANVAS_WIDTH - 2 * PADDING) - (0.5 * EDITOR_CANVAS_WIDTH) + PADDING;
}

/**
 * canvas坐标系的x转化为chart x， chart x取值 -1024 ~ 1024
 * canvas坐标系的x取值 -0.5 * EDITOR_CANVAS_WIDTH + PADDING ~ 0 - PADDING
 */
export function transformXToChartX(x: number) {
  return (
    ((x - PADDING) / (0.5 * EDITOR_CANVAS_WIDTH - 2 * PADDING)) * 2048 - 1024
  );
}

export function getMouseBeat(
  frameData: FrameData,
  mouse: IMouse
): IBeat | null {
  let beatKey = "";
  let minDistance = Infinity;
  const beats = frameData.beats;
  if (!beats) return null;
  Object.keys(beats || {}).forEach((key) => {
    if (Math.abs(beats[key] - (EDITOR_CANVAS_HEIGHT - mouse.y)) < minDistance) {
      minDistance = Math.abs(beats[key] - (EDITOR_CANVAS_HEIGHT - mouse.y));
      beatKey = key;
    }
  });
  return beatKey.split("-").map(Number) as IBeat;
}
