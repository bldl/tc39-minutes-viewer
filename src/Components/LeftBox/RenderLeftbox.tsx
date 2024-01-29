import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
// import "../App.css";

interface Props {
  link: string | null;
}

const RenderMarkdown: React.FC<Props> = ({ link }) => {
  const [markdownContent, setMarkdownContent] = useState("");

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

  return (
    <div>
      <ReactMarkdown className="md">{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default RenderMarkdown;
