import React, { useState } from "react";
import Toolbar from "./Toolbar";
import ReactMarkdown from "react-markdown";
import PreviewToolbar from "./PreviewToolbar";

//Global Variables
const buttonTypes = [
  {
    id: "1",
    name: "bold-text",
    text: "**",
    label: "Bold",
  },
  {
    id: "2",
    name: "italicize-text",
    text: "__",
    label: "Italicize",
  },
  {
    id: "3",
    name: "link-image",
    text: "![image]()",
    label: "Image",
  },
  {
    id: "4",
    name: "link-link",
    text: "[Link]()",
    label: "Link",
  },
  {
    id: "5",
    name: "blockquote",
    text: "> ",
    label: "Quote",
  },
  {
    id: "6",
    name: "bullet-list",
    text: "* ",
    label: "UL",
  },
  {
    id: "7",
    name: "numbered-list",
    text: "1. ",
    label: "OL",
  },
  {
    id: "8",
    name: "line-break",
    text: "---",
    label: "Line Break",
  },
  {
    id: "9",
    name: "inline-code",
    text: "` `",
    label: "Inline Code",
  },
  {
    id: "10",
    name: "code-block",
    text: "``` ```",
    label: "Code Block",
  },
];

function Journal() {
  const [input, setMarkdown] = useState("");
  const [isEditing, setEditing] = useState(true);

  function handleChange(e) {
    setMarkdown(e.target.value);
  }

  function handlePreviewerClick(bool) {
    setEditing(bool);
  }

  function handleToolbarClick(id) {
    setMarkdown(input + buttonTypes[id - 1].text);
  }

  const editingMode = (
    <div className="journal-text-area">
      <textarea
        id="journal"
        placeholder="Write here"
        value={input}
        onChange={handleChange}
      />
    </div>
  );

  const previewMode = (
    <div className="markdown-previewer">
      <ReactMarkdown>{input}</ReactMarkdown>
    </div>
  );

  return (
    <div className="main-interface">
      <Toolbar onClick={handleToolbarClick} buttons={buttonTypes} />
      <PreviewToolbar onClick={handlePreviewerClick} />
      <div>{isEditing ? editingMode : previewMode}</div>
    </div>
  );
}

export default Journal;
