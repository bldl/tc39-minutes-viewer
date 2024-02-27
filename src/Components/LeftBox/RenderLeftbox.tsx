import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";

import { useSelectedText } from "../SelectedTextContext";
import ContextMenu from "../ContextMenu";
import { RoughNotation } from "react-rough-notation";

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
}

const RenderMarkdown: React.FC<Props> = ({ link, onHighlight }) => {
  const [markdownContent, setMarkdownContent] = useState("");
  const { selectedText, setSelectedText } = useSelectedText(); // Consume the context
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!link) {
        const welcomeMessage =
          "## Welcome! Use the navigation bar to the left to select which files you want browse";
        setMarkdownContent(welcomeMessage);
        return;
      }
      try {
        const response = await fetch(link);
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Error loading Markdown file:", error);
      }
    };

    fetchMarkdown();
  }, [link]); // Use link as the dependency for useEffect

  // SelectedTextContent
  const handleTextHighlight = (_e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString();

    if (selection) {
      setSelectedText(selection); // Update the context with selected text
      onHighlight(selection || ""); // TODO: Do we need this?
      console.log(selection);
    }
  };

  // ContextMenu Start
  const handleContextMenu = (event) => {
    event.preventDefault();
    if (selectedText) {
      setContextMenu({
        isVisible: true,
        x: event.clientX,
        y: event.clientY,
      });
    } else {
      setContextMenu((prevState) => ({ ...prevState, isVisible: false }));
    }
  };

  // Function to close the context menu
  const handleClose = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };
  // ContextMenu End

  // Sentiment analysis
  const handleAnalyzeSentiment = () => {
    const textToAnalyze = selectedText;
    if (textToAnalyze) {
      // Perform the sentiment analysis
      try {
        window.api.performSentimentAnalysis(textToAnalyze);
      } catch (error) {
        console.error("Error sending data for analysis:", error);
      }
      // Hide context menu after attempting analysis
      setContextMenu((prevState) => ({ ...prevState, isVisible: false }));
    }
  };

  return (
    <div onContextMenu={handleContextMenu} onMouseUp={handleTextHighlight}>
      {
        <ReactMarkdown className="md" rehypePlugins={[rehypeSlug]}>
          {markdownContent}
        </ReactMarkdown>
      }
      {contextMenu.isVisible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isOpen={contextMenu.isVisible}
          onAnalyzeSentiment={handleAnalyzeSentiment}
          onClose={handleClose}
        />
      )}
        {markdownContent.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {selectedText && line.includes(selectedText) ? (
            <RoughNotation type="highlight" color="yellow" show={true}>
              {line}
            </RoughNotation>
          ) : (
            line
          )}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default RenderMarkdown;
