import { IPhigrosChart } from "@/types/chart";
import { CanvasEditorConfig, useEditor } from "./hooks/useEditor";
import {
  EDITOR_CANVAS_HEIGHT,
  EDITOR_CANVAS_WIDTH,
} from "./render-sdk/constans";
import { getBeatCount } from "@/utils/util";
import { useRef } from "react";
import styles from './index.module.scss';

interface CanvasEditorProps {
  chart: IPhigrosChart;
  audio: HTMLAudioElement;
}

const CanvasEditor: React.FC<CanvasEditorProps> = (props) => {
  const { chart, audio } = props;

  const { canvas, config, scrollRef } = useEditor(chart, audio);

  const beatCount = getBeatCount(audio.duration * 1000, chart.bpm);

  return (
    <div
      ref={scrollRef}
      className={styles['canvas-container']}
      style={{
        height: EDITOR_CANVAS_HEIGHT,
        width: EDITOR_CANVAS_WIDTH,
      }}
    >
      <canvas
        style={{
          position: "sticky",
          left: 0,
          top: 0,
        }}
        ref={canvas}
        width={EDITOR_CANVAS_WIDTH}
        height={EDITOR_CANVAS_HEIGHT}
      />
      <div style={{ height: beatCount * config.beatHeight }}></div>
    </div>
  );
};

export default CanvasEditor;
