import { ILine } from "../line";
import { IRuntimeEvent } from "./event";
import { IRuntimeNote } from "./note";

export interface IRuntimeLine extends Omit<ILine, "notes" | "events">{
  events: IRuntimeEvent[];
  notes: IRuntimeNote[];
}