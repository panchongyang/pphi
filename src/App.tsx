import { Row, Skeleton, Slider } from "antd";
import { mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";
import IPhigrosChartEditor from "./modules/editor";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import CanvasEditor from "./modules/editor-canvas";

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
        <>
          {audio && <CanvasEditor audio={audio} chart={chart} />}
          {/* <IPhigrosPlayer audio={audio} chart={chart} /> */}
        </>
      )}
    </div>
  );
}

export default App;
