import "./App.css";
import {  mockChart } from "./mocks/mock";
import IPhigrosPlayer from "./modules/player";

function App() {
  return <IPhigrosPlayer chart={mockChart} />;
}

export default App;
