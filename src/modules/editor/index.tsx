import { IPhigrosChart } from "@/types/chart";
import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { Button, Col, Row } from "antd";
import BeatLine from "./components/beatLine";
import { beatToTime, getBeatCount } from "@/utils/util";
import { ILine } from "@/types/line";
import EditorConfig, { EditorConfigValue } from "./components/config";
import { cloneDeep } from "lodash";
import VirtualScroll from "@/components/virtualscroll";
import { BEATHEIGHT } from "./contans";
import { audioAnalysies, audioAnalysies2 } from "./utils/audioAnalysies";

interface IPhigrosChartEditorProps {
  chart: IPhigrosChart;
  audio: HTMLAudioElement | undefined;
  onChartChange?: (chart: IPhigrosChart) => void;
}

const IPhigrosChartEditor: React.FC<IPhigrosChartEditorProps> = (props) => {
  const { chart, onChartChange, audio } = props;
  const [ready, setReady] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [config, setConfig] = useState<EditorConfigValue>({
    beatDivision: 4,
    beatHeight: BEATHEIGHT,
  });
  const [line, setLine] = useState<ILine>(chart.lines[0]);
  const [progress, setProgress] = useState(0);
  const [audioAnalysis, setAudioAnalysis] = useState<number[]>([]);

  const beatHeight = config.beatHeight || BEATHEIGHT;

  useEffect(() => {
    setLine((line) => {
      return chart.lines.find((l) => l.id === line.id) || chart.lines[0];
    });
  }, [chart]);

  const division = config.beatDivision || 1;

  useEffect(() => {
    if (!audio) return;
  
    let raf: number;
  
    const handleLoadedMetadata = async () => {
      setReady(true);
      const beatCount = getBeatCount(audio.duration * 1000, chart.bpm);
      setBeatCount(beatCount);
  
      //每帧更新进度
      const updateProgress = () => {
        if (!audio) return;
        setProgress(audio.currentTime / audio.duration);
        raf = requestAnimationFrame(updateProgress);
      };
      raf = requestAnimationFrame(updateProgress);
  
      const audioAnalyis = await audioAnalysies2(
        audio,
        beatToTime([0, 1, division], chart.bpm)
      );
      console.log(audioAnalyis, beatToTime([0, 1, division], chart.bpm));
      setAudioAnalysis(audioAnalyis);
    };
  
    audio.onloadedmetadata = handleLoadedMetadata;
  
    // Trigger the loadedmetadata event by changing the src attribute
    const src = audio.src;
    audio.src = '';
    audio.src = src;
  
    return () => {
      audio.onloadedmetadata = null;
      raf && cancelAnimationFrame(raf);
    };
  }, [audio, chart.music, division]);

  const beatLines = useMemo(() => {
    if (!ready) return null;
    return (
      <VirtualScroll
        className={styles["editor-content"]}
        itemHeight={beatHeight / division}
        style={{
          height: "80vh",
          overflowX: 'visible'
        }}
        reverse
        scrollPos={1 - progress}
      >
        {Array.from({
          length: beatCount * division,
        }).map((_, index) => {
          const beatNumber = Math.floor(index / division) + 1;
          //beat分子
          const beatUp = index % division;
          //beat分母
          const beatDown = config.beatDivision || 1;
          return (
            <Row key={index} className={styles["beat-row"]}>
              <Col>
                <div className={styles["beat-number"]}>
                  {beatUp === 0 ? beatNumber : `${beatUp}/${beatDown}`}
                </div>
              </Col>
              <Col flex={1}>
                <BeatLine
                  analysis={audioAnalysis[index]}
                  beatHeight={beatHeight}
                  height={beatHeight / division}
                  beat={[beatNumber, beatUp, beatDown]}
                  line={line}
                  onChange={() => {
                    onChartChange?.(cloneDeep(chart));
                  }}
                />
              </Col>
            </Row>
          );
        })}
      </VirtualScroll>
    );
  }, [
    audioAnalysis,
    beatCount,
    beatHeight,
    chart,
    config.beatDivision,
    division,
    line,
    onChartChange,
    progress,
    ready,
  ]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["editor"]}>
      <div
        style={{
          position: "relative",
        }}
      >
        {beatLines}
        <div
          style={{
            height: 1,
            background: "green",
            position: "absolute",
            bottom: beatHeight / division / 2 + beatHeight / division,
            width: "calc(100% - 50px)",
            marginLeft: 50,
          }}
        ></div>
      </div>
      <div className={styles["editor-config"]}>
        <Button
          onClick={() => {
            onChartChange?.(cloneDeep(chart));
          }}
        >
          保存
        </Button>
        <EditorConfig
          value={config}
          onChange={(v) => {
            setConfig(v);
          }}
        />
      </div>
    </div>
  );
};

export default IPhigrosChartEditor;
