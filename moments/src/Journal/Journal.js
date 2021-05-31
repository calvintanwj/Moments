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
    text: "****",
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
    text: "__",
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
        alt="Attach Img"
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

  // Just a quick little template for a journal entry.
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const templateEntry =
    "# Moments\n## Past, Present, and Future\n\nToday's date: _" +
    date +
    "_\n\nThis is a journal template \\\n**Click preview** to see your markdown get parsed :)";

  // Controls the state of text written in the journal
  // Text should be blank. May add a template in the future
  const [input, setInput] = useState(templateEntry);

  // Controls the state of whether the user is in editing or preview mode.
  // User starts out in editing mode.
  const [isEditing, setEditing] = useState(true);

  // State of the cursor position
  const [cursor, setCursor] = useState({
    start: 0,
    end: 0,
  });

  // Contains the main logic when text is written in the journal
  function inputText(e) {
    setInput(e.target.value);
    // Because useState is asynchronous, I set using e.target.value instead of input.
    window.localStorage.setItem("entry", e.target.value);
  }

  // Keep track of position of cursor
  function handleCursor(e) {
    setCursor({ start: e.target.selectionStart, end: e.target.selectionEnd });
  }

  // Fetch journal entry from localStorage when it is loaded.
  useEffect(() => {
    const savedEntry = window.localStorage.getItem("entry");
    setInput(savedEntry ?? templateEntry);
  }, []);

  // Contains the main logic when tab is pressed
  function clickTab(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      const start = cursor.start;
      setInput(
        input.substring(0, cursor.start) +
          "    " +
          input.substring(cursor.end, input.length),
        setTimeout(() => {
          const txtarea = document.getElementById("journal-area");
          txtarea.selectionStart = txtarea.selectionEnd = start + 4;
        }, 1)
      );
    }
  }

  // Contains the main logic to toggle between editing and preview mode
  function toggleMode(bool) {
    setEditing(bool);
  }

  // Contains the main logic to handle a toolbar button being clicked
  // Puts the respective markdown in the journal
  // Moves the cursor to the right place
  function toolbarClick(key) {
    const txtarea = document.getElementById("journal-area");
    txtarea.focus();
    const start = cursor.start;
    setInput(
      input.substring(0, cursor.start) +
        buttonTypes[key].text +
        input.substring(cursor.end, input.length),
      setTimeout(() => {
        if (key == 0 || key == 4 || key == 5) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 2;
        } else if (key == 1 || key == 8) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 1;
        } else if (key == 2) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 9;
        } else if (key == 3) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 7;
        } else if (key == 7 || key == 6) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 3;
        }
      }, 1)
    );
  }

  // Editing mode
  const editingMode = (
    <textarea
      id="journal-area"
      value={input}
      // placeholder="Write here"
      onChange={inputText}
      onKeyDown={(e) => clickTab(e)}
      onSelect={(e) => handleCursor(e)}
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
