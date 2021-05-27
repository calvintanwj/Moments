import React from "react";
import MDToolbarButton from "./MDToolbarButton";

// Markdown toolbar component
function MarkdownToolbar({ onClick, buttons }) {
  return (
    <ul id="markdown-toolbar">
      {buttons.map((button) => {
        return <MDToolbarButton onClick={onClick} button={button} />;
      })}
    </ul>
  );
}

export default MarkdownToolbar;
