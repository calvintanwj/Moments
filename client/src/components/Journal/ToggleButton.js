import React from "react";

// Mode toolbar component
function ToggleButton(props) {
  return (
    <>
      <input
        id="mode-switch"
        type="checkbox"
        onChange={props.clickHandler}
        checked={props.active}
      />
      <label for="mode-switch">Toggle</label>
    </>
  );
}

export default ToggleButton;