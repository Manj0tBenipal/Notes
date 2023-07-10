import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function NoteEditor(props) {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const editorRef = useRef(null);
  const handleEditorSave = () => {
    const editorContent = editorRef.current.getContent();
    props.updateBody(editorContent);
  };
  useEffect(() => {
    function handleResize() {
      setScreenHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const editorHeight = screenHeight - props.previewPaneHeight;
  console.log(editorHeight);
  return (
    <section className="editor-pane">
      <div className="controls">
        <input
          name="title"
          type="text"
          className="title-box"
          placeholder="Title"
          value={props.currentNote.title}
          onChange={(event) => props.updateTitle(event.target.value)}
        />
        <button className="button" onClick={handleEditorSave}>
          Save
        </button>
      </div>
      <Editor
        className="tiny-editor"
        key="blbpb8cgs2ltxcqxjpdhxyqk0yb2tjkfl3ujaes5pz8gaj4u"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={props.currentNote.body}
        init={{
          height: editorHeight,
          menubar: false,
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
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </section>
  );
}
