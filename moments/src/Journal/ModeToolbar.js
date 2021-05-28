import React from "react";

// Mode toolbar component
function ModeToolbar({ onClick }) {
  return (
    <div id="mode-toolbar">
      <button id="mdtb-1" className="modetb-bt" onClick={() => onClick(true)}>
        Editing Mode
      </button>
      <button id="mdtb-2" className="modetb-bt" onClick={() => onClick(false)}>
        Preview Mode
      </button>
    </div>
  );
}

export default ModeToolbar;
