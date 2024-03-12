import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { Tab, Tabs } from "@mui/material"; // Import MUI Tab components
import { useSelectedText } from "../SelectedTextContext";
import ContextMenu from "../ContextMenu";
import { RoughNotation } from "react-rough-notation";
import { JSX } from "react/jsx-runtime";

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
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { selectedText, setSelectedText } = useSelectedText();
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
        setOpenTabs((prevTabs) => [...prevTabs, link]);
        setActiveTab(link);
      } catch (error) {
        console.error("Error loading Markdown file:", error);
      }
    };

    fetchMarkdown();
  }, [link]);

  useEffect(() => {
    if (markdownRef.current) {
      markdownRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [markdownContent]);

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

  const handleTextHighlight = (_e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
      setSelectedRange(selection.getRangeAt(0));
      onHighlight(selection.toString());
    }
  };

  const handleContextMenu = (event: {
    preventDefault: () => void;
    clientX: any;
    clientY: any;
  }) => {
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

  const handleClose = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };

  const handleAnalyzeSentiment = () => {
    const textToAnalyze = selectedText;
    if (textToAnalyze) {
      try {
        window.api.performSentimentAnalysis(textToAnalyze);
      } catch (error) {
        console.error("Error sending data for analysis:", error);
      }
      setContextMenu((prevState) => ({ ...prevState, isVisible: false }));
    }
  };

  // Handler for tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      {/* Render tabs */}
      <Tabs value={activeTab} onChange={handleTabChange}>
        {openTabs.map((tabLink) => (
          <Tab
            key={tabLink}
            label={tabLink} // Display tab content
            value={tabLink} // Identify the tab
          />
        ))}
      </Tabs>
      <div onContextMenu={handleContextMenu} onMouseUp={handleTextHighlight}>
        <div ref={markdownRef}>
          <ReactMarkdown
            className="md"
            rehypePlugins={[rehypeSlug]}
          >
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
              background: "rgba(255, 255, 0, 0.3)",
              zIndex: 99,
              top: selectedTextPosition.top,
              left: selectedTextPosition.left,
              width: selectedRange.getBoundingClientRect().width + 15,
              height: selectedRange.getBoundingClientRect().height + 15,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default RenderMarkdown;
