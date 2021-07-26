import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MarkdownEntry.css";

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

// Parsed markdown entry with no toolbar
function MarkdownEntry(props) {
  const entry = props.entry;
  return (
    <div id="journal">
      <button onClick={props.deleteHandler}>
        {" "}
        <i class="fas fa-trash-alt fa-2x"></i>
      </button>
      <div id="entry-text" onClick={props.clickHandler}>
        <h2 id="entry-title">{entry.title}</h2>
        <p>{format(new Date(entry.date), "dd-MM-yyyy")}</p>
        <ReactMarkdown
          components={components}
          remarkPlugins={[gfm]}
        >{entry.entry}</ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownEntry;
