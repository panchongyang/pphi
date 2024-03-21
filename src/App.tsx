import { Row, Skeleton, Slider, Space } from "antd";
import { mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";
import IPhigrosChartEditor from "./modules/editor";
import "./App.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import CanvasEditor from "./modules/editor-canvas";
import { IPhigrosChart } from "./types/chart";

function App() {
  const [chart, setChart] = useState(mockChart);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const ref = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setAudio(ref.current);
      ref.current.onloadedmetadata = () => {
        setReady(true);
      };
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

  const handleChartChange = useCallback((chart: IPhigrosChart) => {
    setChart(chart);
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
      {ready && (
        <Space>
          {audio && (
            <CanvasEditor onChartChange={handleChartChange} audio={audio} chart={chart} />
          )}
          <IPhigrosPlayer audio={audio} chart={chart} />
        </Space>
      )}
    </div>
  );
}

export default App;
