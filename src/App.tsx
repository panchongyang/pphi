import { Row } from "antd";
import { mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";
import IPhigrosChartEditor from "./modules/editor";
import "./App.scss";
import { useState } from "react";

function App() {
  const [chart, setChart] = useState(mockChart);

  return (
    <Row wrap={false}>
      <IPhigrosChartEditor
        chart={chart}
        onChartChange={(chart) => {
          setChart(chart);
        }}
      />
      <IPhigrosPlayer chart={chart} />
    </Row>
  );
}

export default App;
