import React from "react";

// Mode toolbar component
function ModeToolbar({ onClick }) {
  return (
    <>
      <input
        id="mode-switch"
        type="checkbox"
        onClick={() => onClick(!document.getElementById("mode-switch").checked)}
      />
      <label for="mode-switch">Toggle</label>
    </>
  );
}

export default ModeToolbar;
