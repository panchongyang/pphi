import { IPhigrosChart } from "@/types/chart";
import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { Button, Col, Row } from "antd";
import BeatLine from "./components/beatLine";
import { getBeatCount } from "@/utils/util";
import { ILine } from "@/types/line";
import EditorConfig, { EditorConfigValue } from "./components/config";
import { cloneDeep } from "lodash";
import VirtualScroll from "@/components/virtualscroll";
import { BEATHEIGHT } from "./contans";

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
  });
  const [line, setLine] = useState<ILine>(chart.lines[0]);

  useEffect(() => {
    setLine((line) => {
      return chart.lines.find((l) => l.id === line.id) || chart.lines[0];
    });
  }, [chart]);

  const division = config.beatDivision || 1;

  useEffect(() => {
    setReady(false);
    if(!audio) return;

    audio.onloadedmetadata = () => {
      setReady(true);
      const beatCount = getBeatCount(audio.duration * 1000, chart.bpm);
      setBeatCount(beatCount);
    };

    return () => {
      audio.onloadedmetadata = null;
    };
  }, [audio, chart.bpm, chart.music]);

  const beatLines = useMemo(() => {
    if (!ready) return null;
    return (
      <VirtualScroll
        className={styles["editor-content"]}
        itemHeight={BEATHEIGHT / division}
        style={{
          height: "80vh",
        }}
        reverse
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
                  height={BEATHEIGHT / division}
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
    beatCount,
    chart,
    config.beatDivision,
    division,
    line,
    onChartChange,
    ready,
  ]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["editor"]}>
      <div>{beatLines}</div>
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
