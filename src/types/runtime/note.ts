import { INoteDrag, INoteTap, INoteFlick, INoteHold } from "../note";
import { IRuntimeLine } from "./line";

export enum ENoteStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface IRuntimeTap extends Omit<INoteTap, "time"> {
  time: number;
  line: IRuntimeLine;
  status: ENoteStatus;
}

export interface IRuntimeDrag extends Omit<INoteDrag, "time"> {
  time: number;
  line: IRuntimeLine;
  status: ENoteStatus;
}

export interface IRuntimeFlick extends Omit<INoteFlick, "time"> {
  time: number;
  line: IRuntimeLine;
  status: ENoteStatus;
}

export interface IRuntimeHold
  extends Omit<INoteHold, "time" | "duration"> {
  time: number;
  duration: number;
  line: IRuntimeLine;
  status: ENoteStatus;
}

export type IRuntimeNote =
  | IRuntimeTap
  | IRuntimeHold
  | IRuntimeDrag
  | IRuntimeFlick;
