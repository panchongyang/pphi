import { IBPM, IPhigrosChart } from "@/types/chart";
import { IEvent } from "@/types/event";
import { ILine } from "@/types/line";
import { ENoteType, INote } from "@/types/note";
import { IRuntimeBPM, IRuntimeChart } from "@/types/runtime/chart";
import { IRuntimeEvent } from "@/types/runtime/event";
import { EGameStatus, IGame } from "@/types/runtime/game";
import { IRuntimeLine } from "@/types/runtime/line";
import { ENoteStatus, IRuntimeNote } from "@/types/runtime/note";
import { beatToTime } from "@/utils/util";

export function initGame(chart: IPhigrosChart, audio: HTMLAudioElement, status?: EGameStatus): IGame {
  const runTimeChart: IRuntimeChart = {
    ...chart,
    lines: chart.lines.map((line) => transfromLine(line, chart.bpm, audio.currentTime * 1000)),
    bpm: transformBpm(chart.bpm),
  };

  const background = new Image();
  background.src = chart.background;

  console.log(runTimeChart)
  return {
    status: status ?? EGameStatus.NOT_STARTED,
    chart: runTimeChart,
    currentTime: 0,
    audio,
    background: background,
  };
}

function transformBpm(bpm: IBPM[]): IRuntimeBPM[] {
  return bpm.map((item, index, arr) => {
    return {
      target: item.target,
      time: arr[index + 1] ? beatToTime(arr[index + 1].time, bpm) : Infinity,
    };
  });
}

function transfromNote(
  note: INote,
  bpm: IBPM[],
  line: IRuntimeLine,
  time: number
): IRuntimeNote {
  if (note.type === ENoteType.HOLD) {
    return {
      ...note,
      time: beatToTime(note.time, bpm),
      duration: beatToTime(note.duration, bpm),
      line,
      status: time >= beatToTime(note.time, bpm) ? ENoteStatus.IN_PROGRESS : ENoteStatus.NOT_STARTED,
    };
  }
  return {
    ...note,
    time: beatToTime(note.time, bpm),
    line,
    status: time >= beatToTime(note.time, bpm) ? ENoteStatus.FINISHED : ENoteStatus.NOT_STARTED
  };
}

function transformEvent(event: IEvent, bpm: IBPM[]): IRuntimeEvent {
  return {
    ...event,
    startTime: beatToTime(event.startTime, bpm),
    endTime: beatToTime(event.endTime, bpm),
  };
}

function transfromLine(line: ILine, bpm: IBPM[], time: number): IRuntimeLine {
  const runline: IRuntimeLine = {
    ...line,
    notes: [],
    events: line.events.map((event) => transformEvent(event, bpm)),
  };
  runline.notes = line.notes.map((note) => transfromNote(note, bpm, runline, time));
  return runline;
}
