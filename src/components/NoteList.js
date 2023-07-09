import React from "react";
export default function NoteList(props) {
  const noteList = props.notes.map((note) => {
    return (
      <button
        key={note.id}
        className={`note-heading ${
          props.currentNoteId === note.id ? "selected-note" : ""
        }`}
        onClick={() => props.setCurrentNoteId(note.id)}
      >
        {note.title}
      </button>
    );
  });
  return <div className="note-list">{noteList}</div>;
}
