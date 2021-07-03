import React, { useState, useEffect } from "react";
import MarkdownToolbar from "./MarkdownToolbar";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import ModeToolbar from "./ModeToolbar";
import axios from "axios";
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
    id: "block-code",
    text: "~~~java\n\n~~~",
    label: <i class="fas fa-code"></i>,
  },
];

// Journal component
function Journal(props) {
  // Just a quick little template for a journal entry.
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const templateEntry =
    "# Moments\n## Past, Present, and Future\n\nToday's date: _" +
    date +
    "_\n\nThis is a journal template \\\n**Click preview** to see your markdown get parsed :) \n\n~Does~ Now supports strikethroughs, task lists, link literals, and **custom** code blocks\n\nhttps://moments-flax.vercel.app/\n\n* [ ] to do\n\n* [x] done\n\n ~~~java\n function foo() {\n  return;\n}\n ~~~";

  // Controls the state of text written in the journal
  // Text should be blank. May add a template in the future
  const [input, setInput] = useState(props.entry ?? templateEntry);

  // TO CHANGE - Hardcoded value
  const [id, setId] = useState(props.id);

  // Controls the state of whether the user is in editing or preview mode.
  // User starts out in editing mode.
  const [isEditing, setEditing] = useState(true);

  // State of the cursor position
  const [cursor, setCursor] = useState({
    start: 0,
    end: 0,
  });

  // Renderer for custom code blocks
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          style={prism}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
      ) : (
        <code className={className} {...props} />
      );
    },
  };

  // Contains the main logic when text is written in the journal
  async function inputText(e) {
    setInput(e.target.value);
    // Because useState is asynchronous, I set using e.target.value instead of input.
    await axios.put(`http://localhost:5000/journal/${id}`, { entry: e.target.value })
  }

  // Keep track of position of cursor
  function handleCursor(e) {
    setCursor({ start: e.target.selectionStart, end: e.target.selectionEnd });
  }

  // Fetch journal entry from localStorage when it is loaded.
  // useEffect(() => {
  //   async function fetchData() {
  //     const queryObject = await axios.get("http://localhost:5000/journal/2021-04-20");
  //     console.log(queryObject);
  //     const savedEntry = queryObject.data.entries[0].entry;
  //     console.log(savedEntry);
  //     setInput(savedEntry ?? templateEntry);
  //   }
  //   fetchData();
  // }, [templateEntry]);

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
        } else if (key === 1) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 1;
        } else if (key === 2) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 9;
        } else if (key === 3) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 7;
        } else if (key === 7 || key === 6) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 3;
        } else if (key === 8) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 8;
        }
      }, 1)
    );
  }

  // Editing mode
  const editingMode = (
    <>
      <div id="date-with-toolbar-editing">
        <p id="journal-date-editing">{date}</p>
        <MarkdownToolbar
          id="markdown-toolbar-editing"
          onClick={toolbarClick}
          buttons={buttonTypes}
        />
      </div>
      <textarea
        id="journal-area"
        value={input}
        // placeholder="Write here"
        onChange={inputText}
        onKeyDown={(e) => clickTab(e)}
        onSelect={(e) => handleCursor(e)}
      />
    </>
  );

  // Preview mode (makes use of the ReactMarkdown dependency)
  const previewMode = (
    <>
      <div id="date-with-toolbar-preview">
        <p id="journal-date-preview">{date}</p>
        <MarkdownToolbar
          id="markdown-toolbar-preview"
          onClick={toolbarClick}
          buttons={buttonTypes}
        />
      </div>
      <div id="preview-area">
        <ReactMarkdown components={components} remarkPlugins={[gfm]}>
          {input}
        </ReactMarkdown>
      </div>
    </>
  );

  // The overall journal interface.
  return (
    <div id="journal-interface">
      <div id="journal-header">
        <button id="back-button"></button>
        <h2 id="journal-title">Journal Title</h2>
        <ModeToolbar onClick={toggleMode} />
      </div>
      {isEditing ? editingMode : previewMode}
      <div id="docs-link">
        <a href="https://spec.commonmark.org/0.29/">Commonmark Docs</a>
      </div>
    </div>
  );
}

export default Journal;
