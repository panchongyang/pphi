import { IPhigrosChart } from "../chart";
import { IRuntimeLine } from "./line";

export interface IRuntimeChart  extends Omit<IPhigrosChart, 'bpm' | 'lines'> {
  bpm: IRuntimeBPM[];
  lines: IRuntimeLine[];
}

export interface IRuntimeBPM {
  target: number;
  time: number;
}