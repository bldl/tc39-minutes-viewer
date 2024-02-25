import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ChatMessages from "../ChatComponent/ChatMessages";
import TopicList from "./ExtractingAllHeaders";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: true | false;
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  link,
  isLoading,
}: TabBoxProps) => {
  // Sentiment start
  const [sentimentResult, setSentimentResult] = useState<string[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<string>("");

  // Calculate and set overall sentiment based on scores
  useEffect(() => {
    window.api.receiveSentimentAnalysis((event, arg) => {
      const scores = JSON.parse(arg); // Assuming arg is a JSON string that represents an array, e.g., "[1, 1]"
      const sentimentDescriptions = scores.map((score) =>
        interpretSentiment(score)
      );
      setSentimentResult(sentimentDescriptions); // Update the state with an array of descriptions

      const overall = interpretOverallSentiment(scores);
      setOverallSentiment(overall);
    });
  }, []);

  // Convert sentiment analysis numeric result to a descriptive message
  const interpretSentiment = (score) => {
    const sentimentMap = {
      "0": "Negative",
      "1": "Neutral",
      "2": "Positive",
    };
    return sentimentMap[score] || "Unknown"; // Default to 'Unknown' if score is not in the map
  };

  const interpretOverallSentiment = (scores) => {
    if (scores.length === 0) return "No sentiment analysis performed yet.";
    const averageScore =
      scores.reduce((acc, cur) => acc + cur, 0) / scores.length;
    // Define thresholds for categorizing sentiment
    if (averageScore < 0.5) return "Overall sentiment is Negative.";
    else if (averageScore >= 0.5 && averageScore < 1.5)
      return "Overall sentiment is Neutral.";
    else return "Overall sentiment is Positive.";
  };
  // Sentiment end

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    console.log(element);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  function toSlug(topic: string): string {
    return topic
      .toLowerCase() // Convert to lowercase
      .replace(/[\s]+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+/, "") // Trim hyphen from start
      .replace(/-+$/, ""); // Trim hyphen from end
  }
  return (
    <Tabs>
      {/* List of tabs */}
      <TabList>
        {/* Tabs and tab-names */}
        <Tab>ChatGPT</Tab>
        <Tab>Topics</Tab>
        <Tab>Sentiment</Tab>
      </TabList>

      {/* Content for tabs */}

      {/* ChatGPT tab */}
      <TabPanel>
        <ChatMessages messages={messages} isLoading={isLoading} />
      </TabPanel>

      {/* Topics tab */}
      <TabPanel>
        {" "}
        <TopicList
          onTopicClick={function (topic: string): void {
            scrollToSection(toSlug(topic));
          }}
          link={link}
        />
      </TabPanel>

      {/* Sentiment tab */}
      <TabPanel>
        <h2>Sentiment Analysis</h2>
        {sentimentResult.length > 0 ? (
          <>
            <ul>
              {sentimentResult.map((sentiment, index) => (
                <li key={index}>{sentiment}</li>
              ))}
            </ul>
            <p>
              <strong>Overall Sentiment:</strong> {overallSentiment}
            </p>
          </>
        ) : (
          <p>No sentiment analysis has been performed yet.</p>
        )}
      </TabPanel>
    </Tabs>
  );
};

export default TabsComponent;
