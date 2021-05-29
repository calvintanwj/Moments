import React, { useState, useEffect } from "react";
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
    label: (
      <img
        height="20px"
        width="20px"
        alt="Bold Text"
        src="https://img.icons8.com/metro/26/000000/bold.png"
      />
    ),
  },
  {
    key: "1",
    id: "italicize-text",
    text: "_ _",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Italicize Text"
        src="https://img.icons8.com/metro/26/000000/italic.png"
      />
    ),
  },
  {
    key: "2",
    id: "attach-image",
    text: "![image]()",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Attach Image"
        src="https://img.icons8.com/metro/26/000000/xlarge-icons.png"
      />
    ),
  },
  {
    key: "3",
    id: "attach-link",
    text: "[Link]()",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Attach LInk"
        src="https://img.icons8.com/metro/26/000000/add-link.png"
      />
    ),
  },
  {
    key: "4",
    id: "blockquote",
    text: "> ",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Block Quote"
        src="https://img.icons8.com/metro/26/000000/quote.png"
      />
    ),
  },
  {
    key: "5",
    id: "bullet-list",
    text: "* ",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Bullet List"
        src="https://img.icons8.com/metro/26/000000/list.png"
      />
    ),
  },
  {
    key: "6",
    id: "numbered-list",
    text: "1. ",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Numbered List"
        src="https://img.icons8.com/metro/26/000000/numbered-list.png"
      />
    ),
  },
  {
    key: "7",
    id: "line-break",
    text: "---",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Line Break"
        src="https://img.icons8.com/metro/26/000000/horizontal-line.png"
      />
    ),
  },
  {
    key: "8",
    id: "inline-code",
    text: "` `",
    label: (
      <img
        height="20px"
        width="20px"
        alt="Inline Code"
        src="https://img.icons8.com/metro/26/000000/code.png"
      />
    ),
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
    // Because useState is asynchronous, I set using e.target.value instead of input.
    window.localStorage.setItem("entry", e.target.value);
  }
  
  // Fetch journal entry from localStorage when it is loaded.
  useEffect(() => {
    const savedEntry = window.localStorage.getItem("entry");
    setInput(savedEntry ?? "");
  }, []);

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
      <div id="mdtb-block">
        <MarkdownToolbar onClick={toolbarClick} buttons={buttonTypes} />
      </div>
      <div id="modetb-with-area">
        <ModeToolbar onClick={toggleMode} />
        <span>{isEditing ? editingMode : previewMode}</span>
      </div>
      <div id="docs-link">
        <a href="https://spec.commonmark.org/0.29/">Commonmark Docs</a>
      </div>
    </div>
  );
}

export default Journal;
