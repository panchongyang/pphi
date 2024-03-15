import { IEvent } from "./event";
import { INote } from "./note";

export interface ILine {
  id: string;
  notes: INote[];
  events: IEvent[];
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}
