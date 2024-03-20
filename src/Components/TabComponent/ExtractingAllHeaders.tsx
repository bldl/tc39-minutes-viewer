import { Box, ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";

interface Topic {
  id: number;
  name: string;
}

interface TopicListProps {
  onTopicClick: (topic: string) => void;
  link: string | null;
}

const TopicList: React.FC<TopicListProps> = ({ onTopicClick, link }) => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (link) {
      fetchTopicsFromMarkdown();
    }
  }, [link]);

  const fetchTopicsFromMarkdown = async () => {
    try {
      const response = await fetch(link!); // Replace with the path to your Markdown file
      const markdownContent = await response.text();
      const topicsFromMarkdown = extractTopicsFromMarkdown(markdownContent);
      setTopics(topicsFromMarkdown);
    } catch (error) {
      console.error("Error loading Markdown file:", error);
    }
  };

  const extractTopicsFromMarkdown = (markdownContent: string): Topic[] => {
    const lines = markdownContent.split("\n");
    const topics: Topic[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("## ")) {
        const topicName = line.replace(/^##\s*/, "");
        // const topicName = line.replace("##", "");
        topics.push({ id: index, name: topicName });
      }
    });

    return topics;
  };

  const handleTopicClick = (topicName: string) => {
    onTopicClick(topicName);
  };

  const topicButtons = topics.map((topic) => (
    <Button
      key={topic.id}
      onClick={() => handleTopicClick(topic.name)}
      variant="text"
      sx={{
        justifyContent: "flex-start", // Align text to the left
        textTransform: "none", // Prevent uppercase transform
        textAlign: "left", // Ensure text is left aligned within the button
      }}
    >
      {topic.name}
    </Button>
  ));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {topicButtons.length > 0 ? (
        <ButtonGroup
          orientation="vertical"
          aria-label="Vertical button group"
          variant="outlined"
          fullWidth // Ensures the button group takes up the full width
        >
          {topicButtons}
        </ButtonGroup>
      ) : (
        <h2>
          Select an MD file from the navigation bar to display the topics list.
        </h2> // Display this message when topicButtons is empty
      )}
    </Box>
  );
};

export default TopicList;
