import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { IconButton, Tab, Tabs } from "@mui/material"; // Import MUI Tab components
import { useSelectedText } from "../SelectedTextContext";
import ContextMenu from "../ContextMenu";
import { RoughNotation } from "react-rough-notation";
import { JSX } from "react/jsx-runtime";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
  onTabChange: (activeTab: string | null) => void;
}

const RenderMarkdown: React.FC<Props> = ({
  link,
  onHighlight,
  onTabChange,
}) => {
  const [markdownMap, setMarkdownMap] = useState<Map<string, string>>(
    new Map()
  );
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [selectedTextPosition, setSelectedTextPosition] = useState({
    top: 0,
    left: 0,
  });

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [closingTab, setClosingTab] = useState<string | null>(null); // Track the tab being closed

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
        return;
      }
      try {
        const response = await fetch(link);
        const text = await response.text();
        setMarkdownMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(link, text);
          return newMap;
        });
        setActiveTab(link);
        onTabChange(link);
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
  }, [markdownMap]);

  useEffect(() => {
    if (selectedRange) {
      const rangeRect = selectedRange.getBoundingClientRect();
      const containerRect = markdownRef.current?.getBoundingClientRect();

      if (rangeRect && containerRect) {
        setSelectedTextPosition({
          top: rangeRect.top - containerRect.top + 105,
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

  const components = {
    // Your components' overrides...
    h1: (
      props: JSX.IntrinsicAttributes & {
        [x: string]: any;
        level: any;
        children: any;
      }
    ) => <HeaderWithRoughNotation {...props} level={1} />,
    a: ({ children }) => (
      <span
        style={{ cursor: "not-allowed", color: "gray", textDecoration: "none" }}
      >
        {children}
      </span>
    ),
  };

  const HeaderWithRoughNotation = ({ level, children, ...rest }) => {
    const [showAnnotation, setShowAnnotation] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowAnnotation(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }, []);

    const { animationTimingFunction, otherNonStandardProp, ...domProps } = rest;

    const Tag = `h${level}`;
    return (
      <RoughNotation
        {...domProps} // Spread only the props that are valid for the DOM element
        type="highlight"
        show={showAnnotation}
        color="red"
        padding={8}
        strokeWidth={2}
        animationDuration={1000}
        iterations={1}
        animationDelay={300}
        // animationTimingFunction is not passed here
      >
        <Tag>{children}</Tag>
      </RoughNotation>
    );
  };

  // Handler for tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);

    onTabChange(newValue);

    setSelectedRange(null);
    setSelectedText("");
  };

  const handleCloseTab = (link: string) => {
    setClosingTab(link);
    setMarkdownMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(link);
      return newMap;
    });
  };

  useEffect(() => {
    if (closingTab !== null && activeTab === closingTab) {
      const updatedTabs = Array.from(markdownMap.keys());
      const lastTabIndex = updatedTabs.length - 1;
      setActiveTab(lastTabIndex >= 0 ? updatedTabs[lastTabIndex] : null);
      onTabChange(lastTabIndex >= 0 ? updatedTabs[lastTabIndex] : null);
    }
  }, [markdownMap, activeTab, closingTab]);

  return (
    <div>
      {/* Render tabs */}
      <Tabs
        value={
          activeTab !== null && markdownMap.has(activeTab)
            ? activeTab
            : markdownMap.keys().next().value
        }
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        {[...markdownMap.keys()].map((tabLink) => (
          <Tab
            key={tabLink}
            value={tabLink} // Identify the tab
            label={
              <span>
                {tabLink.replace("public/meetings/", "")}
                <IconButton
                  size="small"
                  component="span"
                  onClick={() => handleCloseTab(tabLink)}
                  style={{ marginLeft: "auto" }}
                >
                  <CloseIcon />
                </IconButton>
              </span>
            }
          />
        ))}
      </Tabs>
      <div onContextMenu={handleContextMenu} onMouseUp={handleTextHighlight}>
        <div ref={markdownRef}>
          <ReactMarkdown
            className="md"
            rehypePlugins={[rehypeSlug]}
            components={components}
          >
            {markdownMap.get(activeTab ?? "") ||
              "Choose a file in the navigation bar."}
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
