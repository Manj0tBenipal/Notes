import React, { useState, useEffect } from "react";
import dots from "../img/dots.png";
import bin from "../img/bin.png";
import edit from "../img/editing.png";
import close from "../img/close.png";
import plus from "../img/plus.png";
export default function NoteList(props) {
  const [actionMenu, setActionMenu] = useState({
    id: "",
    hasActionVisible: false,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setActionMenu((prev) => ({ ...prev, hasActionVisible: false }));
    }, 4000); // Specify the interval duration in milliseconds (e.g., 1000ms = 1 second)

    // Cleanup function to clear the interval when the component unmounts or when the effect is re-run
    return () => {
      clearInterval(interval);
    };
  }, []);
  const noteList = props.notes.map((note) => {
    const visible = {
      display: "flex",
    };
    const hidden = {
      display: "none",
    };
    function handleNoteChange(id) {
      props.setCurrentNoteId(id);
      props.isInPreview(false);
    }
    return (
      <div
        className={`note-heading ${
          props.currentNoteId === note.id ? "selected-note" : ""
        }`}
        key={note.id}
      >
        <button
          className="note-selector-title"
          key={note.id}
          onClick={() => props.setCurrentNoteId(note.id)}
        >
          {note.title}
        </button>
        <div className="note-action-menu">
          <span
            style={
              note.id === actionMenu.id && actionMenu.hasActionVisible
                ? visible
                : hidden
            }
            className="note-action-buttons"
          >
            <img
              src={bin}
              alt="delete"
              onClick={() => props.deleteNote(note.id)}
            />
            <img
              src={edit}
              alt="edit"
              onClick={() => handleNoteChange(note.id)}
            />
          </span>

          <img
            src={
              actionMenu.hasActionVisible && note.id === actionMenu.id
                ? close
                : dots
            }
            className="note-action-menu-trigger"
            alt="menu"
            onClick={() =>
              setActionMenu((a) => ({
                id: note.id,
                hasActionVisible: !a.hasActionVisible,
              }))
            }
          />
        </div>
      </div>
    );
  });
  return (
    <div className="note-list">
      <div className="note-list-header">
        <h1>Notes</h1>
        <img
          className="add-note-button"
          src={plus}
          alt="addNote"
          onClick={props.createNewNote}
        />
      </div>
      {noteList}
    </div>
  );
}
