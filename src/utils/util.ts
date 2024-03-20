import { IBeat } from "@/types/beat";
import { IBPM, IPhigrosChart } from "../types/chart";

export const parseChartJson = (json: string) => {
  try {
    const chart: IPhigrosChart = JSON.parse(json);
    return chart;
  } catch (e) {
    return null;
  }
};

export const beatToTime = (beat: IBeat, bpm: IBPM[]) => {
  const [beatCount, up, down] = beat;
  const time = bpm
    .map((item, index, arr) => {
      return {
        target: item.target,
        time: arr[index + 1]
          ? arr[index + 1].time
          : ([Infinity, 0, 1] as IBeat),
      };
    })
    .reduce((acc, cur) => {
      if (compareBeat(beat, cur.time) < 0) {
        //返回当前bpm下的时间
        return ((60 * 1000) / cur.target) * (beatCount + up / down);
      } else if (compareBeat(beat, cur.time) > 0) {
        return (
          ((60 * 1000) / cur.target) *
            (cur.time[0] + cur.time[1] / cur.time[2]) +
          acc
        );
      } else {
        return ((60 * 1000) / cur.target) * (beatCount + up / down);
      }
    }, 0);
  return time;
};

//比较两个beat谁大谁小
//返回值小于0，beat1小于beat2
//返回值大于0，beat1大于beat2
//返回值等于0，beat1等于beat2
export const compareBeat = (beat1: IBeat, beat2: IBeat) => {
  const [beatCount1, up1, down1] = beat1;
  const [beatCount2, up2, down2] = beat2;
  if (beatCount1 !== beatCount2) {
    return beatCount1 - beatCount2;
  }
  return up1 / down1 - up2 / down2;
};

//根据时间和bpm数组返回beat总数
export const getBeatCount = (time: number, bpm: IBPM[]) => {
  const res = bpm.reduce((acc, cur, index, arr) => {
    if (arr[index + 1] && beatToTime(arr[index + 1].time, bpm) <= time) {
      return (
        acc +
        (beatToTime(arr[index + 1].time, bpm) - beatToTime(cur.time, bpm)) *
          (cur.target / 60 / 1000)
      );
    } else {
      return (
        acc + (time - beatToTime(cur.time, bpm)) * (cur.target / 60 / 1000)
      );
    }
  }, 0);
  return res;
};
