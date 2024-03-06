import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ChatMessages from "../ChatComponent/ChatMessages";
import TopicList from "./ExtractingAllHeaders";
import { annotate } from "rough-notation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: true | false;
  showTopicsTab: boolean;
  showSentimentTab: boolean;
  showGptTab: boolean;
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  link,
  isLoading,
  showTopicsTab,
  showGptTab,
  showSentimentTab,
}: TabBoxProps) => {
  // Sentiment start
  const [sentimentResult, setSentimentResult] = useState<string[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<string>("");
  const [lastTopicClick, setLastTopicClick] = useState<{
    topic: string;
    time: number;
  }>({
    topic: "",
    time: 0,
  });

  // Calculate and set overall sentiment based on scores
  useEffect(() => {
    window.api.receiveSentimentAnalysis((event: any, arg: string) => {
      const scores = JSON.parse(arg); // Assuming arg is a JSON string that represents an array, e.g., "[1, 1]"
      const sentimentDescriptions = scores.map((score: string | number) =>
        interpretSentiment(score)
      );
      setSentimentResult(sentimentDescriptions); // Update the state with an array of descriptions

      const overall = interpretOverallSentiment(scores);
      setOverallSentiment(overall);
    });
  }, []);

  // Convert sentiment analysis numeric result to a descriptive message
  const interpretSentiment = (score: string | number) => {
    const sentimentMap = {
      "0": "Negative",
      "1": "Neutral",
      "2": "Positive",
    };
    return sentimentMap[score] || "Unknown"; // Default to 'Unknown' if score is not in the map
  };

  const interpretOverallSentiment = (scores: any[]) => {
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

  const scrollToSection = (id: string, topic: string) => {
    const currentTime = new Date().getTime();
    if (
      topic === lastTopicClick.topic &&
      currentTime - lastTopicClick.time < 2000
    ) {
      // It's been less than two seconds since the last click of the same topic
      return;
    }

    // Update last topic click with the current topic and time
    setLastTopicClick({ topic, time: currentTime });

    // Proceed with scrolling and annotating the element
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Wait until scroll if finished before annotating the element
      setTimeout(() => {
        annotateElement(element);
      }, 700);
    }
  };

  const annotateElement = (element: Element) => {
    const annotation = annotate(element, {
      type: "underline",
      color: "black" /* default */,
      padding: 5,
      strokeWidth: 2,
      iterations: 1,
    });
    annotation.show();
    // Automatically hide the annotation after a delay if you want
    setTimeout(() => {
      annotation.hide();
    }, 2000);
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
      {!showGptTab && !showTopicsTab && !showSentimentTab && (
        <h2>
          Here we can add instructions for the app. The text will disappear once
          a tab is opened.
        </h2>
      )}
      {/* List of tabs */}
      {(showGptTab || showTopicsTab || showSentimentTab) && (
        <TabList>
          {/* Tabs and tab-names */}
          {showGptTab && <Tab>ChatGPT</Tab>}
          {showTopicsTab && <Tab>Topics</Tab>}
          {showSentimentTab && <Tab>Sentiment</Tab>}
        </TabList>
      )}

      {/* Content for tabs */}

      {showGptTab && (
        <TabPanel>
          <ChatMessages messages={messages} isLoading={isLoading} />
        </TabPanel>
      )}

      {showTopicsTab && (
        <TabPanel>
          {" "}
          <TopicList
            onTopicClick={function (topic: string): void {
              scrollToSection(toSlug(topic), topic);
            }}
            link={link}
          />
        </TabPanel>
      )}

      {/* Sentiment tab */}
      {showSentimentTab && (
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
      )}
    </Tabs>
  );
};

export default TabsComponent;
