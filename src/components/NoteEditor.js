import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function NoteEditor(props) {
  const editorRef = useRef(null);
  const handleEditorSave = () => {
    const editorContent = editorRef.current.getContent();
    props.updateBody(editorContent);
  };

  return (
    <section className="editor-pane">
      <div className="controls">
        <button className="button" onClick={props.deleteNote}>
          Delete
        </button>
        <button className="button" onClick={handleEditorSave}>
          Save
        </button>
        <button className="button" onClick={props.addNote}>
          Add
        </button>
      </div>
      <div>
        <input
          name="title"
          type="text"
          className="title-box"
          placeholder="Title"
          value={props.currentNote.title}
          onChange={(event) => props.updateTitle(event.target.value)}
        />
      </div>
      <Editor
        className="tiny-editor"
        key="blbpb8cgs2ltxcqxjpdhxyqk0yb2tjkfl3ujaes5pz8gaj4u"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={props.currentNote.body}
        init={{
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
