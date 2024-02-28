import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";

import { useSelectedText } from "../SelectedTextContext";
import ContextMenu from "../ContextMenu";
import "./styles.css"; // Import CSS file

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
}

const RenderMarkdown: React.FC<Props> = ({ link, onHighlight }) => {
  const [markdownContent, setMarkdownContent] = useState("");
  const { highlightSelect, setHighlightSelect } = useSelectedText(); 
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

  let oldRange: Range | null = null;
  let oldHighlightedText: string | null = null;
  
  const handleTextHighlight = (_e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString();
    const highlightSelection = window.getSelection();

    if (selection) {
      setSelectedText(selection); // Update the context with selected text
      onHighlight(selection); // TODO: Do we need this?
    }

    console.log(highlightSelection?.toString());

    if (!highlightSelection || highlightSelection.isCollapsed) return;
  
    const range = highlightSelection.getRangeAt(0);
    if (!range) return;
  
    const selectedText = highlightSelection.toString();
    if (!selectedText.trim()) return; // Check if selected text is non-empty
  
    // Restore previously highlighted text to its original state
    if (oldRange && oldHighlightedText) {
      restoreOriginalState(oldRange, oldHighlightedText);
    }
  
    // Create a new span element for the selected text
    const newNode = document.createElement("span");
    newNode.style.backgroundColor = "yellow";
    newNode.textContent = selectedText; // Set the text content of the new node
  
    // Insert the new node with the background color
    range.deleteContents(); // Remove the existing selection
    range.insertNode(newNode);
  
    // Check if the selection contains newlines
    const containsNewlines = /\n|\r/.test(selectedText);
  
    // If newlines are present, insert newline characters within the new span element
    if (containsNewlines) {
      const newlineNodes = selectedText.split(/\n|\r/).map((line, index) => {
        const newNode = document.createElement("span");
        newNode.style.backgroundColor = "yellow";
        newNode.textContent = line;
        if (index < selectedText.length - 1) {
          newNode.appendChild(document.createElement("br")); // Insert a <br> element after each line except the last one
        }
        return newNode;
      });
  
      // Replace the content of the new span element with the newline nodes
      newNode.textContent = '';
      newlineNodes.forEach(node => newNode.appendChild(node));
    }
  
    // Store the current range and highlighted text
    oldRange = range.cloneRange();
    oldHighlightedText = newNode.textContent;
  };
  
  // Function to restore the original state of previously highlighted text
  const restoreOriginalState = (range: { deleteContents: () => void; insertNode: (arg0: HTMLSpanElement) => void; }, highlightedText: string | null) => {
    const newNode = document.createElement("span");
    newNode.textContent = highlightedText;
    range.deleteContents();
    range.insertNode(newNode);
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
    <div
      className="markdown-container"
      onContextMenu={handleContextMenu}
      onMouseUp={handleTextHighlight}
    >
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
      {contextMenu.isVisible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isOpen={contextMenu.isVisible}
          onAnalyzeSentiment={handleAnalyzeSentiment}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default RenderMarkdown;
