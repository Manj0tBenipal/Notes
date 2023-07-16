import React from "react";

export default function PreviewPane(props) {
  return (
    <div className={`preview-pane ${props.darkMode ? "dark" : ""}`}>
      <h1 className="preview-mode-heading ">{props.note.title}</h1>
      <p
        className="preview-mode-body"
        dangerouslySetInnerHTML={{ __html: props.note.body }}
      ></p>
    </div>
  );
}
