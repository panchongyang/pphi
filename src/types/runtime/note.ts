import { INoteDrag, INoteTap, INoteFlick, INoteHold } from "../note";
import { IRuntimeLine } from "./line";

export interface IRuntimeTap extends Omit<INoteTap, "time"> {
  time: number;
  line: IRuntimeLine;
}

export interface IRuntimeDrag extends Omit<INoteDrag, "time"> {
  time: number;
  line: IRuntimeLine;
}

export interface IRuntimeFlick extends Omit<INoteFlick, "time"> {
  time: number;
  line: IRuntimeLine;
}

export interface IRuntimeHold
  extends Omit<INoteHold, "time" | "duration"> {
  time: number;
  duration: number;
  line: IRuntimeLine;
}

export type IRuntimeNote =
  | IRuntimeTap
  | IRuntimeHold
  | IRuntimeDrag
  | IRuntimeFlick;
