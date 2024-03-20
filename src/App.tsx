import { Row, Slider } from "antd";
import { mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";
import IPhigrosChartEditor from "./modules/editor";
import "./App.scss";
import { useEffect, useRef, useState } from "react";

function App() {
  const [chart, setChart] = useState(mockChart);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const ref = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setAudio(ref.current);
      //每帧更新进度
      const updateProgress = () => {
        if (ref.current) {
          setProgress(ref.current.currentTime / ref.current.duration);
          requestAnimationFrame(updateProgress);
        }
      };
      requestAnimationFrame(updateProgress);
    }
  }, []);

  return (
    <div>
      <audio ref={ref} src={chart.music} controls></audio>
      <Slider
        value={1000000 * progress}
        min={0}
        max={1000000}
        onChange={(v) => {
          if (audio) {
            audio.currentTime = (v / 1000000) * audio.duration;
          }
        }}
      />
      <Row wrap={false}>
        <IPhigrosChartEditor
          chart={chart}
          onChartChange={(chart) => {
            setChart(chart);
          }}
          audio={audio}
        />
        <IPhigrosPlayer audio={audio} chart={chart} />
      </Row>
    </div>
  );
}

export default App;
