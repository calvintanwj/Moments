import React from "react";
import MDToolbarButton from "./MDToolbarButton";

// Markdown toolbar component
function MarkdownToolbar({ id, onClick, buttons }) {
  return (
    <div id={id}>
      {buttons.map((button) => {
        return <MDToolbarButton onClick={onClick} button={button} />;
      })}
    </div>
  );
}

export default MarkdownToolbar;
