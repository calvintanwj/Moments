import React from "react";

// Mode toolbar component
function ModeToolbar({ onClick }) {
  return (
    <div id="mode-toolbar">
      <button className="modetb-bt" onClick={() => onClick(true)}>
        Editing Mode
      </button>
      <button className="modetb-bt" onClick={() => onClick(false)}>
        Preview Mode
      </button>
    </div>
  );
}

export default ModeToolbar;
