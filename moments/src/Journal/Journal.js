import React, { useState, useEffect } from "react";
import MarkdownToolbar from "./MarkdownToolbar";
import ReactMarkdown from "react-markdown";
import ModeToolbar from "./ModeToolbar";
import "./Journal.css";

// Global Variables

// Consists of all the button types within the journal toolbar.
const buttonTypes = [
  {
    key: 0,
    id: "bold-text",
    text: "****",
    label: <i class="fas fa-bold"></i>,
  },
  {
    key: 1,
    id: "italicize-text",
    text: "__",
    label: <i class="fas fa-italic"></i>,
  },
  {
    key: 2,
    id: "attach-image",
    text: "![image]()",
    label: <i class="far fa-images"></i>,
  },
  {
    key: 3,
    id: "attach-link",
    text: "[Link]()",
    label: <i class="fas fa-link"></i>,
  },
  {
    key: 4,
    id: "blockquote",
    text: "> ",
    label: <i class="fas fa-quote-right"></i>,
  },
  {
    key: 5,
    id: "bullet-list",
    text: "* ",
    label: <i class="fas fa-list"></i>,
  },
  {
    key: 6,
    id: "numbered-list",
    text: "1. ",
    label: <i class="fas fa-list-ol"></i>,
  },
  {
    key: 7,
    id: "line-break",
    text: "---",
    label: <i class="fas fa-grip-lines"></i>,
  },
  {
    key: 8,
    id: "inline-code",
    text: "` `",
    label: <i class="fas fa-code"></i>,
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
  }, [templateEntry]);

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
        if (key === 0 || key === 4 || key === 5) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 2;
        } else if (key === 1 || key === 8) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 1;
        } else if (key === 2) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 9;
        } else if (key === 3) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 7;
        } else if (key === 7 || key === 6) {
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
      <div id="journal-header">
        <button id="back-button"></button>
        <h2 id="journal-title">Journal Title</h2>
        <ModeToolbar onClick={toggleMode} />
      </div>
      <div id="date-with-toolbar">
        <p id="journal-date">{date}</p>
        <MarkdownToolbar onClick={toolbarClick} buttons={buttonTypes} />
      </div>
      <div id="text-area">{isEditing ? editingMode : previewMode}</div>
      <div id="docs-link">
        <a href="https://spec.commonmark.org/0.29/">Commonmark Docs</a>
      </div>
    </div>
  );
}

export default Journal;
