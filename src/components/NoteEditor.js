import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import tick from "../img/tick.png";
export default function NoteEditor(props) {
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const editorRef = useRef(null);
  const handleEditorSave = () => {
    const editorContent = editorRef.current.getContent();
    setIsSaved(true);
    props.updateBody(editorContent);
  };
  const editorHeight = screenHeight - props.tabsHeight - controlsHeight - 200;
  const [init, setInit] = useState({
    height: editorHeight,
    menubar: true,
    plugins: [
      "a11ychecker",
      "advlist",
      "advcode",
      "advtable",
      "autolink",
      "checklist",
      "export",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "powerpaste",
      "fullscreen",
      "formatpainter",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | casechange blocks | bold italic backcolor | " +
      "alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
    content_style: "body { font-family:Arial,sans-serif; font-size:22px }",
  });
  useEffect(() => {
    const obj = props.darkMode
      ? { ...init, skin: "oxide-dark", content_css: "dark" }
      : { ...init };
    setInit({ ...obj });
    //Unmounting and mounting TinyMCE to change the theme which otherwise does not take affect
    setIsEditorVisible(false);
    setTimeout(() => {
      setIsEditorVisible(true);
    });
  }, [props.darkMode]);
  const controlsRef = useRef(null);
  useEffect(() => {
    function handleResize() {
      setScreenHeight(window.innerHeight);
    }
    function handleControlHeight() {
      const height = controlsRef.current.offsetHeight;
      console.log(height);
      setControlsHeight(height);
    }
    window.addEventListener("resize", handleControlHeight);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleControlHeight);
    };
  }, []);
  useEffect(() => {
    const saved = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    return () => clearTimeout(saved);
  }, [isSaved]);

  return (
    <section className="editor-pane">
      <div className="controls" ref={controlsRef}>
        <input
          name="title"
          type="text"
          className={`title-box ${props.darkMode ? "dark" : ""}`}
          placeholder="Title"
          value={props.currentNote.title}
          onChange={(event) => props.updateTitle(event.target.value)}
        />
        {isSaved ? (
          <img className="save-icon" src={tick} alt="saved icon" />
        ) : (
          <button className="button" onClick={handleEditorSave}>
            Save
          </button>
        )}
      </div>
      {isEditorVisible && (
        <Editor
          className="tiny-editor"
          key="blbpb8cgs2ltxcqxjpdhxyqk0yb2tjkfl3ujaes5pz8gaj4u"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={props.currentNote.body}
          init={init}
        />
      )}
    </section>
  );
}
