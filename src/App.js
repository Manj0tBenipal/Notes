import React, { useState, useEffect } from "react";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import "./App.css";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, notesCollection } from "./firebase";
import PreviewPane from "./components/PreviewPane";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(
    notes.length > 0 ? notes[0].id : ""
  );
  const [isInPreview, setIsInPreview] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [previewPaneHeight, setPreviewPaneHeight] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notes = snapshot.docs
        .map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
      setNotes(notes);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const updatedNotes = notes;
    if (currentNoteId === "" && updatedNotes.length > 0) {
      setCurrentNoteId(updatedNotes[0].id);
    }
  }, [notes]);

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
        <div className="container">
          <NoteList
            notes={notes}
            currentNoteId={currentNoteId}
            setCurrentNoteId={setCurrentNoteId}
            isInPreview={setIsInPreview}
            deleteNote={deleteTheNote}
            createNewNote={addNewNote}
          />

          <div className="editor-preview">
            <div className="tab-section">
              <button
                className={`tabs ${isInPreview ? "selected" : ""}`}
                onClick={() => setIsInPreview(true)}
              >
                Preview
              </button>
              <button
                className={`tabs ${isInPreview ? "" : "selected"}`}
                onClick={() => setIsInPreview(false)}
              >
                Edit
              </button>
            </div>

            {isInPreview ? (
              <PreviewPane
                note={notes.find((note) => note.id === currentNoteId)}
              />
            ) : (
              <NoteEditor
                currentNote={notes.find((note) => note.id === currentNoteId)}
                updateTitle={updateNoteTitle}
                updateBody={updateNoteBody}
                addNote={addNewNote}
                deleteNote={deleteTheNote}
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
