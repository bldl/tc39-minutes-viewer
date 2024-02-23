import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
// import "../App.css";

import { useSelectedText } from "../SelectedTextContext"; // Adjust path as necessary

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
}

const RenderMarkdown: React.FC<Props> = ({ link, onHighlight }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  const { setSelectedText } = useSelectedText(); // Consume the context

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!link) {
        const welcomeMessage =
          "## Welcome! Use the navigation bar to the left to select which files you want browse";
        setMarkdownContent(welcomeMessage);
        return;
      }

      try {
        console.log(link); // Correctly using link here
        const response = await fetch(link);
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Error loading Markdown file:", error);
      }
    };

    fetchMarkdown();
  }, [link]); // Use link as the dependency for useEffect

  const handleTextHighlight = (_e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setSelectedText(selection); // Update the context with selected text
      onHighlight(selection); // If you still need to use this for other purposes
    }
  };

  return (
    <div onMouseUp={handleTextHighlight}>
      <ReactMarkdown className="md" rehypePlugins={[rehypeSlug]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default RenderMarkdown;
