import { usePlayer } from "./hooks/usePlayer";
import { IPhigrosChart } from "@/types/chart";

interface IPhigrosPlayerProps {
  chart: IPhigrosChart;
  audio: HTMLAudioElement;
}

const IPhigrosPlayer: React.FC<IPhigrosPlayerProps> = (props) => {
  const { chart, audio } = props;
  const { ref } = usePlayer(chart, audio);

  return <canvas ref={ref}></canvas>;
};

export default IPhigrosPlayer;
