import React from "react";
import MDToolbarButton from "./MDToolbarButton";

// Markdown toolbar component
function MarkdownToolbar({ onClick, buttons }) {
  return (
    <div id="markdown-toolbar">
      {buttons.map((button) => {
        return <MDToolbarButton onClick={onClick} button={button} />;
      })}
    </div>
  );
}

export default MarkdownToolbar;
