import "./App.css";
import { mockAudio, mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";

function App() {
  return <IPhigrosPlayer chart={mockChart} audio={mockAudio} />;
}

export default App;
