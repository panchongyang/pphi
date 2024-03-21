import { INote, NoteColor } from "@/types/note";
import { CanvasEditorConfig, IScroll } from "../hooks/useEditor";
import { getCanvasYFromBeat, transformX } from "./utils";

interface IRenderNoteProps {
  notes: INote[];
  context: CanvasRenderingContext2D;
  scroll: IScroll;
  config: CanvasEditorConfig
}

export function renderNotes(props: IRenderNoteProps) {
  const { notes, context, scroll, config } = props;
  notes.forEach((note) => {
    const y = getCanvasYFromBeat({
      beatHeight: config.beatHeight,
      scroll,
      beat: note.time,
    });
    const noteWitdh = 20;
    const startX = transformX(note.x) - noteWitdh / 2;
    context.save();
    context.strokeStyle = NoteColor[note.type];
    // 一根线，宽4px
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(startX, y);
    context.lineTo(startX + noteWitdh, y);
    context.stroke();
    context.restore();
  });
}
