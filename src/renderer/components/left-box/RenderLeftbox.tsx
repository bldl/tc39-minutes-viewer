import React, { useState, useEffect, useRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { IconButton, Paper, Tab, Tabs } from "@mui/material"; // Import MUI Tab components
import { useSelectedText } from "../contexts/SelectedTextContext";
import { RoughNotation } from "react-rough-notation";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

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

  const { setSelectedText } = useSelectedText();

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
          top: rangeRect.top - containerRect.top + 50,
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

  interface HeaderWithRoughNotationProps {
    level: number; // Assuming level is a number 1 through 6 for h1 through h6
    children: ReactNode; // ReactNode type covers anything that could be rendered: numbers, strings, elements or an array (or fragment) containing these types.
    [key: string]: any; // For any other props that might be passed
  }

  interface CustomComponents {
    h1: React.ComponentType<any>; // Use a more specific type if known
    a: React.ComponentType<{ children: ReactNode }>;
  }

  const components: CustomComponents = {
    h1: ({ children, ...props }) => (
      <HeaderWithRoughNotation {...props} level={1}>
        {children}
      </HeaderWithRoughNotation>
    ),
    a: ({ children }) => (
      <span
        style={{ cursor: "not-allowed", color: "gray", textDecoration: "none" }}
      >
        {children}
      </span>
    ),
  };

  const HeaderWithRoughNotation: React.FC<HeaderWithRoughNotationProps> = ({
    level,
    children,
    ...rest
  }) => {
    const [showAnnotation, setShowAnnotation] = useState<boolean>(true);
    const theme = useTheme();

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowAnnotation(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }, []);

    const highlightColor =
      theme.palette.mode === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.main;

    return (
      <RoughNotation
        {...rest} // Spread the remaining props to RoughNotation
        type="highlight"
        show={showAnnotation}
        color={highlightColor}
        padding={8}
        strokeWidth={2}
        animationDuration={1000}
        iterations={1}
        animationDelay={300}
      >
        {React.createElement(`h${level}`, {}, children)}
      </RoughNotation>
    );
  };

  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);

    onTabChange(newValue);

    setSelectedRange(null);
    setSelectedText("");

    if (markdownRef.current) {
      markdownRef.current.scrollTop = 0; // Scrolls to the top
    }
  };

  useEffect(() => {
    // Ensures that the content scrolls to the top when the activeTab changes
    if (markdownRef.current) {
      markdownRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

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

  const handleTabName = (tabLink: string) => {
    //remove the file path and keep only the file name

    let baseStart = "tc39://";
    const fileName = tabLink.substring(16);

    return fileName;
  };

  return (
    <>
      <Paper
        elevation={3}
        style={{
          padding: "10px",
          borderRadius: "20px",
          overflowX: "hidden",
          overflowY: "hidden",
          position: "relative",
          width: "40vw",
          height: "9.5vh",
        }}
      >
        <Tabs
          style={{
            padding: "10px",
            borderRadius: "20px",
            overflowX: "hidden",
            position: "relative",
            width: "40vw",
            height: "9.5vh",
            marginTop: "-5px",
          }}
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
                  {handleTabName(tabLink)}

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
              style={{ fontSize: "14px" }}
            />
          ))}
        </Tabs>
      </Paper>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "70vh",
          width: "40vw",
          borderRadius: "20px",
          position: "relative",
          overflowX: "hidden",
          marginTop: "5px",
        }}
      >
        <div>
          <div onMouseUp={handleTextHighlight}>
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
      </Paper>
    </>
  );
};

export default RenderMarkdown;
