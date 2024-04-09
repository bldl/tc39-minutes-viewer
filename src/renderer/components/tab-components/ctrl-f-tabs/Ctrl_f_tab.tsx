import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useRef } from "react";

interface CustomSearchComponentProps {
  link: string | null;
  person: string;
}

const CustomSearchComponent: React.FC<CustomSearchComponentProps> = ({
  person, link,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matches, setMatches] = useState<
    Array<{ index: number; length: number }>
  >([]);
  const [content, setContent] = useState<string>("");
  const matchRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const theme = useTheme();
  

  useEffect(() => {
    fetchTextFromMarkdown();
  }, [link]);

  // Changes the search term to the person that the user wants to search with when user is updated.
  useEffect(() => {
      setSearchTerm(person);
      console.log(searchTerm);
      searchContent;
  }, [person]);

  const fetchTextFromMarkdown = async () => {
    try {
      const response = await fetch(link!);
      const markdownContent = await response.text();
      setContent(markdownContent);
    } catch (error) {
      console.error("Error loading Markdown file:", error);
    }
  };

  useEffect(() => {
    if (
      currentIndex >= 0 &&
      currentIndex < matchRefs.current.length &&
      matchRefs.current[currentIndex]
    ) {
      // Check if the current match reference exists and is not null
      const currentMatchElement = matchRefs.current[currentIndex];
      if (currentMatchElement) {
        currentMatchElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (matches.length > 0 && currentIndex === 0) {
      // Ensure the first match's ref is not null
      if (matchRefs.current[0]) {
        matchRefs.current[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentIndex, matches]);

  const searchContent = () => {
    setCurrentIndex(0);
    setMatches([]);

    if (!searchTerm) return;

    const searchRegex = new RegExp(searchTerm, "gi");
    const newMatches = [...content.matchAll(searchRegex)].map((match) => ({
      index: match.index!,
      length: match[0].length,
    }));

    setMatches(newMatches);
    matchRefs.current = new Array(newMatches.length).fill(null);
  };

  const navigateMatches = (direction: number) => {
    if (matches.length === 0) return;
    const newIndex =
      (currentIndex + direction + matches.length) % matches.length;
    setCurrentIndex(newIndex);
  };

  const highlightedContent = () => {
    let lastIndex = 0;
    let result: Array<React.ReactNode> = [];
    matches.forEach((match, index) => {
      const backgroundColor =
        theme.palette.mode === "light"
          ? index === currentIndex
            ? "yellow"
            : "lightgrey" // Light mode colors
          : index === currentIndex
          ? "#ff4a4a"
          : "lightgrey"; // Replace these with your preferred dark mode colors

      result.push(content.substring(lastIndex, match.index));
      result.push(
        <span
          ref={(el) => (matchRefs.current[index] = el)}
          key={index}
          style={{ backgroundColor }}
        >
          {content.substr(match.index, match.length)}
        </span>
      );
      lastIndex = match.index + match.length;
    });

    result.push(content.substring(lastIndex));
    return <span>{result}</span>;
  };

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 39,
          background: "white",
          padding: "10px",
          zIndex: 1,
          borderColor: "grey", // Example: Blue border color
          borderWidth: "1px", // Sets the width of the border
          borderStyle: "solid", // Required to make the border visible
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{
            fontSize: "15px", // Makes the text inside the input larger
          }}
        />
        <button onClick={searchContent}>Search</button>
        <button onClick={() => navigateMatches(-1)}>Prev</button>
        <button onClick={() => navigateMatches(1)}>Next</button>
        <span>
          {matches.length > 0 ? `${currentIndex + 1}/${matches.length}` : "0/0"}
        </span>
      </div>
      <div style={{ marginTop: "20px", position: "relative" }}>
        {highlightedContent()}
      </div>
    </div>
  );
};

export default CustomSearchComponent;
