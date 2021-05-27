import React, { useState } from "react";
import MarkdownToolbar from "./MarkdownToolbar";
import ReactMarkdown from "react-markdown";
import ModeToolbar from "./ModeToolbar";

// Global Variables

// Consists of all the button types within the journal toolbar.
const buttonTypes = [
  {
    key: "0",
    id: "bold-text",
    text: "** **",
    label: "Bold",
  },
  {
    key: "1",
    id: "italicize-text",
    text: "_ _",
    label: "Italicize",
  },
  {
    key: "2",
    id: "link-image",
    text: "![image]()",
    label: "Image",
  },
  {
    key: "3",
    id: "link-link",
    text: "[Link]()",
    label: "Link",
  },
  {
    key: "4",
    id: "blockquote",
    text: "> ",
    label: "Quote",
  },
  {
    key: "5",
    id: "bullet-list",
    text: "* ",
    label: "UL",
  },
  {
    key: "6",
    id: "numbered-list",
    text: "1. ",
    label: "OL",
  },
  {
    key: "7",
    id: "line-break",
    text: "---",
    label: "Line Break",
  },
  {
    key: "8",
    id: "inline-code",
    text: "` `",
    label: "Inline Code",
  },
  {
    key: "9",
    id: "code-block",
    text: "``` ```",
    label: "Code Block",
  },
];

// Journal component
function Journal() {
  // Controls the state of text written in the journal
  // Text should be blank. May add a template in the future
  const [input, setInput] = useState("");

  // Controls the state of whether the user is in editing or preview mode.
  // User starts out in editing mode.
  const [isEditing, setEditing] = useState(true);

  // Contains the main logic when text is written in the journal
  function inputText(e) {
    setInput(e.target.value);
  }

  // Contains the main logic when tab is pressed
  function clickTab(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      setInput(input + "    ");
    }
  }

  // Contains the main logic to toggle between editing and preview mode
  function toggleMode(bool) {
    setEditing(bool);
  }

  // Contains the main logic to handle a toolbar button being clicked
  // Puts the respective markdown in the journal
  function toolbarClick(key) {
    const txtarea = document.getElementById("journal-area");
    txtarea.focus();
    setInput(
      input.substring(0, txtarea.selectionStart) +
        buttonTypes[key].text +
        input.substring(txtarea.selectionStart + buttonTypes[key].text.length)
    );
    console.log(txtarea.selectionStart);
    txtarea.setSelectionRange(0, 3);
  }

  // Editing mode
  const editingMode = (
    <textarea
      id="journal-area"
      placeholder="Write here"
      value={input}
      onChange={inputText}
      onKeyDown={(e) => clickTab(e)}
    />
  );

  // Preview mode (makes use of the ReactMarkdown dependency)
  const previewMode = (
    <div id="preview-area">
      <ReactMarkdown>{input}</ReactMarkdown>
    </div>
  );

  // The overall journal interface.
  return (
    <div id="main-interface">
      <MarkdownToolbar onClick={toolbarClick} buttons={buttonTypes} />
      <div id="modetb-with-area">
        <ModeToolbar onClick={toggleMode} />
        <span>{isEditing ? editingMode : previewMode}</span>
      </div>
    </div>
  );
}

export default Journal;
