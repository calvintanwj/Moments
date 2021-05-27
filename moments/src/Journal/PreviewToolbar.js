import React from "react";

function PreviewToolbar(props) {
  return (
    <div>
      <button onClick={() => props.onClick(true)}>Editing Mode</button>
      <button onClick={() => props.onClick(false)}>Preview Mode</button>
    </div>
  );
}

export default PreviewToolbar;
