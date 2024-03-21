import { IPhigrosChart } from "@/types/chart";
import { CanvasEditorConfig, useEditor } from "./hooks/useEditor";
import {
  EDITOR_CANVAS_HEIGHT,
  EDITOR_CANVAS_WIDTH,
} from "./render-sdk/constans";
import { getBeatCount } from "@/utils/util";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { InputNumber, Slider } from "antd";

interface CanvasEditorProps {
  chart: IPhigrosChart;
  audio: HTMLAudioElement;
  onChartChange?: (chart: IPhigrosChart) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = (props) => {
  const { chart, audio, onChartChange } = props;
  const [activeLine, setActiveLine] = useState(chart.lines[0]);

  useEffect(() => {
    setActiveLine(
      chart.lines.find((l) => l.id === activeLine.id) || chart.lines[0]
    );
  }, [activeLine.id, chart]);

  const { canvas, config, scrollRef } = useEditor(
    chart,
    audio,
    activeLine,
    onChartChange
  );

  const beatCount = getBeatCount(audio.duration * 1000, chart.bpm);

  return (
    <>
      <Slider
        min={40}
        max={2000}
        defaultValue={config.beatHeight}
        onChange={(v) => {
          config.beatHeight = v;
        }}
      />
      <Slider
        min={1}
        max={64}
        defaultValue={config.division}
        onChange={(v) => {
          config.division = v;
        }}
      />
      <div
        ref={scrollRef}
        className={styles["canvas-container"]}
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
    </>
  );
};

export default CanvasEditor;
