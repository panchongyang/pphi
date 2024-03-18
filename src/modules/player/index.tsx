import { usePlayer } from "./hooks/usePlayer";
import { IPhigrosChart } from "@/types/chart";

interface IPhigrosPlayerProps {
  chart: IPhigrosChart;
  audio: HTMLAudioElement;
}

const IPhigrosPlayer: React.FC<IPhigrosPlayerProps> = (props) => {
  const { chart, audio } = props;
  const { ref, start, pause, continueGame } = usePlayer(chart, audio);

  return (
    <>
      <button onClick={start}>开始</button>
      <button onClick={pause}>暂停</button>
      <button onClick={continueGame}>继续</button>
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
    </>
  );
};

export default IPhigrosPlayer;
