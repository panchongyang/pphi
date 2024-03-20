import { Row } from "antd";
import { mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";
import IPhigrosChartEditor from "./modules/editor";
import "./App.scss";
import { useEffect, useRef, useState } from "react";

function App() {
  const [chart, setChart] = useState(mockChart);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ref.current) {
      setAudio(ref.current);
    }
  }, [])


  return (
    <div>
      <audio ref={ref} src={chart.music} controls></audio>
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
