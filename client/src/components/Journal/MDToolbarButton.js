import React from "react";

// Markdown toolbar button component
function MDToolbarButton({ onClick, button }) {
  return (
    <button
      key={button.key}
      id={button.id}
      title={button.name}
      className="markdowntb-bt"
      onClick={() => onClick(button.key)}
    >
      {button.label}
    </button>
  );
}

export default MDToolbarButton;
