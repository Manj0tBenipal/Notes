import React, { useState, useEffect, useRef } from "react";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import "./App.css";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, notesCollection } from "./firebase";
import PreviewPane from "./components/PreviewPane";
import notebook from "./img/notebook.png";
import darkmode from "./img/dark-mode.png";
import lightmode from "./img/light-mode.png";

export default function App() {
  const [notes, setNotes] = useState([]);

  const [currentNoteId, setCurrentNoteId] = useState(
    notes.length > 0 ? notes[0].id : ""
  );
  const [isInPreview, setIsInPreview] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [notesTabVisibility, setNotesTabVisibility] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const tabsRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notes = snapshot.docs
        .map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
      setNotes(notes);
    });
    function handleWidthChange() {
      setScreenWidth(window.innerWidth);
    }
    function handleHeightChange() {
      const height = tabsRef.current.offsetHeight;
      setTabsHeight(height);
    }
    function cleanup() {
      unsubscribe();
      window.removeEventListener("resize", handleWidthChange);
      window.removeEventListener("resize", handleHeightChange);
    }
    window.addEventListener("resize", handleWidthChange);

    window.addEventListener("resize", handleHeightChange);

    return cleanup;
  }, []);

  useEffect(() => {
    const updatedNotes = notes;
    if (currentNoteId === "" && updatedNotes.length > 0) {
      setCurrentNoteId(updatedNotes[0].id);
    }
  }, [notes]);

  //Applying dark mode to editor requires unmounting the NoteEditor
  //Achieved through changing the view mode from preview to editor
  //and then reverting to original state
  function toggleDarkMode() {
    const prevTab = isInPreview;
    setDarkMode((prevMode) => !prevMode);
    setIsInPreview(true);
    setTimeout(() => {
      setIsInPreview(prevTab);
    }, 0.2);
  }

  async function updateNoteBody(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      {
        body: text,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  }

  async function updateNoteTitle(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      {
        title: text,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  }

  async function addNewNote() {
    const newNote = {
      title: "Your Title",
      body: "Your Note",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const docRef = await addDoc(notesCollection, newNote);
    console.log(docRef.data, docRef.id);
    setCurrentNoteId(docRef.id);
  }

  async function deleteTheNote(id) {
    const nextNoteIndex = notes.findIndex((note) => note.id !== id);
    const nextNoteId = nextNoteIndex !== -1 ? notes[nextNoteIndex].id : "";
    setCurrentNoteId(nextNoteId);

    const docRef = doc(db, "notes", id);
    await deleteDoc(docRef);
  }

  return (
    <>
      {currentNoteId !== "" && notes.length > 0 ? (
        <div className={`container ${darkMode ? "dark" : ""}`}>
          {screenWidth > 720 || (screenWidth < 720 && notesTabVisibility) ? (
            <NoteList
              notes={notes}
              currentNoteId={currentNoteId}
              setCurrentNoteId={setCurrentNoteId}
              isInPreview={setIsInPreview}
              deleteNote={deleteTheNote}
              createNewNote={addNewNote}
              darkMode={darkMode}
            />
          ) : null}
          <div className="editor-preview">
            <div ref={tabsRef} className="tab-section">
              {screenWidth < 720 && (
                <img
                  className="notes-icon"
                  src={notebook}
                  onClick={() => setNotesTabVisibility((a) => !a)}
                  alt="notes icon"
                />
              )}

              <div>
                <button
                  className={`tabs ${isInPreview ? "selected" : ""} ${
                    darkMode ? "dark" : ""
                  }`}
                  onClick={() => setIsInPreview(true)}
                >
                  Preview
                </button>
                <button
                  className={`tabs ${isInPreview ? "" : "selected"} ${
                    darkMode ? "dark" : ""
                  }`}
                  onClick={() => setIsInPreview(false)}
                >
                  Edit
                </button>
              </div>
              <div>
                <img
                  className="dark-mode-toggler"
                  onClick={() => toggleDarkMode()}
                  src={darkMode ? lightmode : darkmode}
                  alt="toggle dark mode"
                />
              </div>
            </div>

            {isInPreview ? (
              <PreviewPane
                note={notes.find((note) => note.id === currentNoteId)}
                darkMode={darkMode}
              />
            ) : (
              <NoteEditor
                currentNote={notes.find((note) => note.id === currentNoteId)}
                updateTitle={updateNoteTitle}
                updateBody={updateNoteBody}
                addNote={addNewNote}
                deleteNote={deleteTheNote}
                tabsHeight={tabsHeight}
                darkMode={darkMode}

              />
            )}
          </div>
        </div>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={addNewNote}>
            Create one now
          </button>
        </div>
      )}
    </>
  );
}
