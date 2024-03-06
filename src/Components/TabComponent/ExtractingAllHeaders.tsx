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
        topics.push({ id: index, name: topicName });
      }
    });

    return topics;
  };

  const handleTopicClick = (topicName: string) => {
    onTopicClick(topicName);
  };

  return (
    <div style={{  padding: "20px" }}>
      <h2>{topics.length > 0 ? "Topics" : "No md file selected"}</h2>
      <ul>
        {topics.map((topic) => (
          <li
            style={{ cursor: "pointer" }}
            key={topic.id}
            onClick={() => handleTopicClick(topic.name)}
          >
            {topic.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;
