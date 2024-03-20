import { IBPM, IPhigrosChart } from "@/types/chart";
import { EEventType, IEvent } from "@/types/event";
import { ILine } from "@/types/line";
import music from "@/assets/ETIA. - MVURBD.mp3";
import background from "@/assets/下载.jpg";
import { ENoteType, INote } from "@/types/note";

export const mockBpm: IBPM[] = [
  {
    target: 175,
    time: [0, 0, 1],
  },
];

const mockLine1: ILine = {
  id: "1",
  notes: [],
  events: [
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [0, 0, 1],
      startValue: 0,
      endValue: 1,
      type: EEventType.OPACITY,
      speed: "linear",
    },
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [1, 0, 1],
      startValue: 0,
      endValue: -350,
      type: EEventType.Y,
      speed: "linear",
    },
    ...Array.from(
      { length: 600 },
      (_, i) =>
        ({
          id: `e${i}`,
          startTime: [i, 0, 1],
          endTime: [i + 1, 0, 1],
          startValue: [10, -10][i % 2],
          endValue: [10, -10][(i + 1) % 2],
          type: EEventType.ROTATION,
          speed: "ease-out-sine",
        } as IEvent)
    ),
  ],
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 0,
  speed: 7,
};

// mockLine1.notes = getMockNotes();

const mockLine2: ILine = {
  events: [
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [0, 0, 1],
      startValue: 0,
      endValue: 1,
      type: EEventType.OPACITY,
      speed: "linear",
    },
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [0, 0, 1],
      startValue: 0,
      endValue: 90,
      type: EEventType.ROTATION,
      speed: "linear",
    },
    {
      id: "e1",
      startTime: [0, 0, 1],
      endTime: [10, 0, 1],
      startValue: -1024,
      endValue: 1024,
      type: EEventType.X,
      speed: "ease-out-sine",
    },
    {
      id: "e1",
      startTime: [10, 0, 1],
      endTime: [20, 0, 1],
      startValue: 1024,
      endValue: 0,
      type: EEventType.X,
      speed: "ease-out-quad",
    },
    {
      id: "e1",
      startTime: [20, 0, 1],
      endTime: [22, 0, 1],
      startValue: 1,
      endValue: 0,
      type: EEventType.OPACITY,
      speed: "linear",
    },
  ],
  id: "l2",
  notes: [],
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 0,
  speed: 7,
};

export const mockChart: IPhigrosChart = {
  id: "c1",
  author: "",
  music: music,
  lines: [mockLine1, mockLine2],
  bpm: mockBpm,
  offset: 0,
  background: background
};

function getMockNotes(): INote[] {
  const notes: INote[] = [];
  for (let i = 0; i < 600; i++) {
    notes.push({
      id: i.toString(),
      time: [i, 0, 1],
      type: ENoteType.TAP,
      x: Math.random() * 1400 - 700,
    });
  }
  return notes;
}
