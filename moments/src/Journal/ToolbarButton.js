import React from "react";

function ToolbarButton({ onClick, button }) {
  return (
    <button
      id={button.id}
      className={button.name}
      onClick={() => onClick(button.id)}
    >
      {button.label}
    </button>
  );
}

export default ToolbarButton;
