import { useState, useEffect } from "react";
// import MarkDown from "markdown-to-jsx";
import ReactMarkdown from "react-markdown";
import "../../App.css";

const RenderMarkdown = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const file_name = "../../public/meetings/2015-11/nov-17.md";

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(file_name);
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Error loading Markdown file:", error);
      }
    };

    fetchMarkdown();
  }, [file_name]);

  return (
    <div>
      <ReactMarkdown className="md">{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default RenderMarkdown;
