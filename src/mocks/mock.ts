import { IBPM, IPhigrosChart } from "@/types/chart";
import { EEventType } from "@/types/event";
import { ILine } from "@/types/line";
import music from "@/assets/Felis.mp3";
import { beatToTime } from "@/utils/util";

export const mockBpm: IBPM[] = [
  {
    target: 120,
    time: [Infinity, 0, 1],
  },
];

const mockLine1: ILine = {
  id: "1",
  notes: [],
  events: [
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [180, 0, 1],
      startValue: 0,
      endValue: 360 * 20,
      type: EEventType.ROTATION,
      speed: "",
    },
  ],
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 0,
};

const mockLine2: ILine = {
  events: [
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [0, 0, 1],
      startValue: 0,
      endValue: 90,
      type: EEventType.ROTATION,
      speed: "",
    },
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [10, 0, 1],
      startValue: -1024,
      endValue: 1024,
      type: EEventType.X,
      speed: "",
    },
    {
      id: "e1",
      startTime: [10, 0, 1],
      endTime: [20, 0, 1],
      startValue: 1024,
      endValue: 0,
      type: EEventType.X,
      speed: "",
    },
  ],
  id: "l2",
  notes: [],
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 0
}

export const mockChart: IPhigrosChart = {
  id: "c1",
  author: "",
  music: "",
  lines: [mockLine1, mockLine2],
  bpm: mockBpm,
  offset: 0,
};

export const mockAudio = new Audio(music);
