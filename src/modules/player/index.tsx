import { usePlayer } from "./hooks/usePlayer";
import { IPhigrosChart } from "@/types/chart";

interface IPhigrosPlayerProps {
  chart: IPhigrosChart;
}

const IPhigrosPlayer: React.FC<IPhigrosPlayerProps> = (props) => {
  const { chart } = props;
  const { ref, start, pause, continueGame, audioRef } = usePlayer(chart);

  return (
    <div>
      <button onClick={start}>开始</button>
      <button onClick={pause}>暂停</button>
      <button onClick={continueGame}>继续</button>
      <audio src={chart.music} ref={audioRef} controls></audio>
      <div>
        <canvas
          style={{
            border: "1px solid #000",
          }}
          width={1024}
          height={700}
          ref={ref}
        ></canvas>
      </div>
    </div>
  );
};

export default IPhigrosPlayer;
