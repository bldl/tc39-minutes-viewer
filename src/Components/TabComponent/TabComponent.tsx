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
  const [sentimentResult, setSentimentResult] = useState<string | null>(null);

  useEffect(() => {
    window.api.receiveSentimentAnalysis((event, arg) => {
      setSentimentResult(`Sentiment analysis result: ${arg}`);
    });
  }, []);
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
        {/* Display the sentiment analysis result directly */}
        {sentimentResult && <p>{sentimentResult}</p>}
      </TabPanel>
    </Tabs>
  );
};

export default TabsComponent;
