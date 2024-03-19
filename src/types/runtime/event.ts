import { IEvent } from "../event";

export interface IRuntimeEvent extends Omit<IEvent, "startTime" | "endTime">{
  startTime: number;
  endTime: number;
}