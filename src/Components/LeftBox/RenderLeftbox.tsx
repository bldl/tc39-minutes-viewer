import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";

import { useSelectedText } from "../SelectedTextContext";
import ContextMenu from "../ContextMenu";

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
}

const RenderMarkdown: React.FC<Props> = ({ link, onHighlight }) => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [selectedTextPosition, setSelectedTextPosition] = useState({
    top: 0,
    left: 0,
  });

  const { selectedText, setSelectedText } = useSelectedText(); // Consume the context
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });

  const markdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (selectedRange) {
      const rangeRect = selectedRange.getBoundingClientRect();
      const containerRect = markdownRef.current?.getBoundingClientRect();

      if (rangeRect && containerRect) {
        setSelectedTextPosition({
          top: rangeRect.top - containerRect.top + 47,
          left: rangeRect.left - containerRect.left + 10,
        });
      }
    }
  }, [selectedRange]);

  // SelectedTextContent
  const handleTextHighlight = (_e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString()); // Update the context with selected text
      setSelectedRange(selection.getRangeAt(0));
      onHighlight(selection.toString()); // TODO: Do we need this?
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
      <div ref={markdownRef}>
        <ReactMarkdown className="md" rehypePlugins={[rehypeSlug]}>
          {markdownContent}
        </ReactMarkdown>
      </div>
      {contextMenu.isVisible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isOpen={contextMenu.isVisible}
          onAnalyzeSentiment={handleAnalyzeSentiment}
          onClose={handleClose}
        />
      )}
      {selectedRange && (
        <div
          style={{
            position: "absolute",
            background: "rgba(0, 0, 255, 0.3)",
            zIndex: 99,
            top: selectedTextPosition.top,
            left: selectedTextPosition.left,
            width: selectedRange.getBoundingClientRect().width + 15,
            height: selectedRange.getBoundingClientRect().height + 15,
          }}
        ></div>
      )}
    </div>
  );
};

export default RenderMarkdown;
