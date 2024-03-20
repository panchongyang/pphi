import { IBeat } from "@/types/beat";
import styles from "./index.module.scss";
import { ENoteType, INote, NoteColor } from "@/types/note";
import { ILine } from "@/types/line";
import { useEffect, useRef, useState } from "react";
import { Row } from "antd";
import { BEATHEIGHT } from "../../contans";
import { compareBeat } from "@/utils/util";

interface BeatLineProps {
  beat: IBeat;
  line: ILine;
  onChange?: (line: ILine) => void;
  height: number;
}

const getPositionX = (note: INote) => {
  //把note的x转化为定位x note的x取值为 -1024 ～ 1024， 定位x取值为0 ～ 750
  return ((note.x + 1024) / 2048) * 750;
};
//把定位x转化为note的x note的x取值为 -1024 ～ 1024， 定位x取值为0 ～ 750
const getNoteX = (x: number) => {
  return (x / 750) * 2048 - 1024;
};

const getBeatNote = (beat: IBeat, notes: INote[]) => {
  return notes.filter((note) => {
    return note.time[0] === beat[0];
  });
};

const ceateIdContext = () => {
  let id = 0;
  return () => {
    id = id + 1;
    return id;
  };
};

const getId = ceateIdContext();

const BeatLine: React.FC<BeatLineProps> = (props) => {
  const { beat, line, onChange } = props;
  const [viewNote, setViewNote] = useState<INote>();
  const rowRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      //按下d键时，删除当前beat的note
      if (e.key === "d" && focus) {
        line.notes = line.notes.filter((note) => {
          return compareBeat(note.time, beat) !== 0;
        });
        onChange?.(line);
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [beat, focus, line, onChange])

  return (
    <Row
      ref={rowRef}
      onMouseOver={() => {
        setFocus(true);
      }}
      onMouseMove={(e) => {
        const rowRect = rowRef.current?.getBoundingClientRect(); // 获取Row元素的位置和大小
        const relativeX = e.clientX - (rowRect?.left || 0); // 计算鼠标相对于Row元素的位置
        setViewNote({
          type: ENoteType.TAP,
          id: `viewNote`,
          time: beat,
          x: getNoteX(relativeX), // 使用相对位置
        });
      }}
      onMouseLeave={() => {
        setViewNote(undefined);
        setFocus(false);
      }}
      className={styles["beat"]}
      onClick={(e) => {
        //x根据点击位置计算
        const rowRect = rowRef.current?.getBoundingClientRect(); // 获取Row元素的位置和大小
        const relativeX = e.clientX - (rowRect?.left || 0); // 计算鼠标相对于Row元素的位置
        line.notes.push({
          type: ENoteType.TAP,
          id: `${line.id}-${getId()}`,
          time: beat,
          x: getNoteX(relativeX),
        });
        onChange?.(line);
      }}
      style={{
        height: props.height,
      }}
    >
      <div className={styles["beat-line"]}>
        {beat[1] === 0 &&
          getBeatNote(beat, line.notes).map((item) => {
            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  position: "absolute",
                  width: 60,
                  height: 8,
                  backgroundColor: NoteColor[item.type],
                  left: getPositionX(item),
                  top: -4 + -(BEATHEIGHT / item.time[2]) * item.time[1],
                }}
              ></div>
            );
          })}
        {viewNote && (
          <div
            key={viewNote.id}
            style={{
              position: "absolute",
              width: 60,
              height: 8,
              backgroundColor: NoteColor[viewNote.type],
              left: getPositionX(viewNote),
              top: -4,
              opacity: 0.5,
            }}
          />
        )}
      </div>
    </Row>
  );
};

export default BeatLine;
