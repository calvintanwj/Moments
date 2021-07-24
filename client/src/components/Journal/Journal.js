import React, { useState } from "react";
import MarkdownToolbar from "./MarkdownToolbar";
import ToggleButton from "./ToggleButton";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import "./Journal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format } from "date-fns";

// Global Variables
// Consists of all the button types within the journal toolbar.
const buttonTypes = [
  {
    key: 0,
    id: "bold-text",
    name: "Bold",
    text: "**text**",
    label: <i class="fas fa-bold"></i>,
    inline: true,
  },
  {
    key: 1,
    id: "italicize-text",
    name: "Italics",
    text: "_text_",
    label: <i class="fas fa-italic"></i>,
    inline: true,
  },
  {
    key: 2,
    id: "attach-image",
    name: "Add image",
    text: "![text](url)",
    label: <i class="far fa-images"></i>,
    inline: true,
  },
  {
    key: 3,
    id: "attach-link",
    name: "Add link",
    text: "[text](url)",
    label: <i class="fas fa-link"></i>,
    inline: true,
  },
  {
    key: 4,
    id: "blockquote",
    name: "Blockquote",
    text: "> text",
    label: <i class="fas fa-quote-right"></i>,
    inline: false,
  },
  {
    key: 5,
    id: "bullet-list",
    name: "Unordered list",
    text: "* text",
    label: <i class="fas fa-list"></i>,
    inline: false,
  },
  {
    key: 6,
    id: "numbered-list",
    name: "Ordered list",
    text: "1. text",
    label: <i class="fas fa-list-ol"></i>,
    inline: false,
  },
  {
    key: 7,
    id: "line-break",
    name: "Line break",
    text: "\n---\ntext",
    label: <i class="fas fa-grip-lines"></i>,
    inline: true,
  },
  {
    key: 8,
    id: "block-code",
    name: "Code block",
    text: "~~~java\ntext\n~~~",
    label: <i class="fas fa-code"></i>,
    inline: false,
  },
];

// Helper function to replace and format text that go between markdown
function replaceText(templateText, text, inline) {
  if (templateText.search("text") !== -1) {
    return `${inline ? " " : "\n"}${templateText.replace("text", text)}${
      inline ? " " : "\n"
    }`;
  }
  return `${inline ? " " : "\n"}${templateText} ${text}${inline ? " " : "\n"}`;
}

// Journal component
function Journal(props) {
  // Just a quick little template for a journal entry.
  var entry = props.entry;
  const templateEntry = "";
  const animate = props.animate;
  // "# Moments\n## Past, Present, and Future\n\nToday's date: _" +
  // date +
  // "_\n\nThis is a journal template \\\n**Click preview** to see your markdown get parsed :) \n\n~Does~ Now supports strikethroughs, task lists, link literals, and **custom** code blocks\n\nhttps://moments-flax.vercel.app/\n\n* [ ] to do\n\n* [x] done\n\n ~~~java\n function foo() {\n  return;\n}\n ~~~";

  // Controls the state of text written in the journal
  // Text should be blank. May add a template in the future
  const [input, setInput] = useState(entry.entry ?? templateEntry);
  const [index, setIndex] = useState(props.index);

  // ID of journal entry
  const [title, setTitle] = useState(entry.title);

  const [date, setDate] = useState(Date.parse(entry.date));

  // Controls the state of whether the user is in editing or preview mode.
  // User starts out in editing mode.
  const [isEditing, setEditing] = useState(false);

  // State of the cursor position
  const [cursor, setCursor] = useState({
    start: 0,
    end: 0,
  });

  // Contains the main logic when text is written in the journal
  async function inputTextHandler(e) {
    const newEntry = {
      title,
      entry: e.target.value,
      date: format(date, "yyyy-MM-dd"),
      _id: entry._id,
    };
    setInput(e.target.value);
    props.editHandler(newEntry, index);
    // Because useState is asynchronous, I set using e.target.value instead of input.
    // await axios.put(`http://localhost:5000/journal/${entry._id}`, newEntry)
    await axios.put(
      `https://momentsorbital.herokuapp.com/journal/${entry._id}`,
      newEntry
    );
  }

  async function titleHandler(e) {
    const newEntry = {
      title: e.target.value,
      entry: input,
      date: format(date, "yyyy-MM-dd"),
      _id: entry._id,
    };
    setTitle(e.target.value);
    props.editHandler(newEntry, index);
    // Because useState is asynchronous, I set using e.target.value instead of input.
    // await axios.put(`http://localhost:5000/journal/${entry._id}`, newEntry)
    await axios.put(
      `https://momentsorbital.herokuapp.com/journal/${entry._id}`,
      newEntry
    );
  }

  async function dateHandler(date) {
    const newEntry = {
      title,
      entry: input,
      date: format(date, "yyyy-MM-dd"),
      _id: entry._id,
    };
    setDate(date);
    props.editHandler(newEntry);
    // await axios.put(`http://localhost:5000/journal/${entry._id}`, newEntry)
    await axios.put(
      `https://momentsorbital.herokuapp.com/journal/${entry._id}`,
      newEntry
    );
    props.dateChangeHandler(date);
    // const numPosts = await axios.get(
    //   `http://localhost:5000/journal/${format(date, "yyyy-MM-dd")}`,
    //   newEntry
    // );
    const numPosts = await axios.get(
      `https://momentsorbital.herokuapp.com/journal/${format(
        date,
        "yyyy-MM-dd"
      )}`,
      newEntry
    );
    console.log(`New Index: ${numPosts.data.entries.length - 1}`);
    setIndex(numPosts.data.entries.length - 1);
    // await axios.put(`https://momentsorbital.herokuapp.com/journal/${entry._id}`, newEntry)
  }

  // Keep track of position of cursor
  function handleCursor(e) {
    setCursor({ start: e.target.selectionStart, end: e.target.selectionEnd });
  }

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
          const txtarea = document.getElementById("journal-input-edit");
          txtarea.selectionStart = txtarea.selectionEnd = start + 4;
        }, 1)
      );
    }
  }

  // Contains the main logic to toggle between editing and preview mode
  function toggleMode() {
    console.log(input);
    setEditing(!isEditing);
  }

  // Contains the main logic to handle a toolbar button being clicked
  // Puts the respective markdown in the journal
  // Moves the cursor to the right place
  async function toolbarClick(key) {
    const txtarea = document.getElementById("journal-input-edit");
    txtarea.focus();
    const start = cursor.start;
    const pressedKey = buttonTypes[key];
    const selectedText = input.substring(cursor.start, cursor.end);
    const newText =
      input.substring(0, cursor.start) +
      replaceText(pressedKey.text, selectedText, pressedKey.inline) +
      input.substring(cursor.end, input.length);
    setInput(
      newText,
      setTimeout(() => {
        if (key === 0 || key === 4 || key === 5) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 3;
        } else if (key === 1) {
          txtarea.selectionStart = txtarea.selectionEnd = start + 2;
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

    const newEntry = {
      title,
      entry: newText,
      date: format(date, "yyyy-MM-dd"),
      _id: entry._id,
    };
    props.editHandler(newEntry, index);
    // await axios.put(`http://localhost:5000/journal/${entry._id}`, newEntry);
    await axios.put(
      `https://momentsorbital.herokuapp.com/journal/${entry._id}`,
      newEntry
    );
  }

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

  const MarkdownEntry = (
    <div
      id="preview-area"
      class={animate ? "expand" : ""}
      onClick={props.clickHandler}
    >
      <h2 id="journal-title-preview">{title}</h2>
      <p id="journal-date-preview">{format(date, "dd-MM-yyyy")}</p>
      <ReactMarkdown components={components} remarkPlugins={[gfm]}>
        {input}
      </ReactMarkdown>
    </div>
  );

  // Editing mode
  const editingMode = (
    <>
      <div id="date-with-toolbar-editing" class={animate ? "pop" : ""}>
        <MarkdownToolbar
          id="markdown-toolbar-editing"
          class={animate ? "appear" : ""}
          onClick={toolbarClick}
          buttons={buttonTypes}
        />
      </div>
      <div id="edit-area" class={animate ? "contract" : ""}>
        <input id="journal-title-edit" value={title} onChange={titleHandler} />
        <DatePicker
          selected={date}
          onChange={(date) => dateHandler(date)}
          dateFormat={"dd-MM-yyy"}
          className="no-border text-font"
        />
        <textarea
          id="journal-input-edit"
          value={input}
          // placeholder="Write here"
          onChange={inputTextHandler}
          onKeyDown={(e) => clickTab(e)}
          onSelect={(e) => handleCursor(e)}
        />
      </div>
    </>
  );

  // Only one journal entry can be selected at a time
  // the selected entry can be edited
  const selectedEntry = (
    <div id="journal-interface">
      <div id="journal-header">
        <button id="back-button" onClick={props.unselectHandler}></button>
        <div id="header-right">
          <button id="delete-button" onClick={() => props.deleteHandler(index)}>
            <i class="fas fa-trash-alt fa-2x"></i>
          </button>
          <ToggleButton clickHandler={toggleMode} active={!isEditing} />
        </div>
      </div>
      {isEditing ? editingMode : MarkdownEntry}
      <div id="docs-link">
        <a
          href="https://spec.commonmark.org/0.29/"
          title="Markdown documentation used to format your journal entries"
        >
          Commonmark Docs
        </a>
      </div>
    </div>
  );

  // The overall journal interface.
  return <>{selectedEntry}</>;
}

export default Journal;
