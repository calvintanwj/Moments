import React from "react";
import ToolbarButton from "./ToolbarButton";

function Toolbar({ onClick, buttons }) {
  return (
    <ul className="journal-toolbar">
      <li>
        <ToolbarButton onClick={onClick} button={buttons[0]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[1]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[2]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[3]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[4]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[5]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[6]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[7]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[8]} />
      </li>
      <li>
        <ToolbarButton onClick={onClick} button={buttons[9]} />
      </li>
    </ul>
  );
}

export default Toolbar;
