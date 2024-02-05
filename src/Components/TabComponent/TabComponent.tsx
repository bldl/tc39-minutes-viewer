import React from "react";
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
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  link,
}: TabBoxProps) => {
  return (
    <Tabs>
      {/* List of tabs */}
      <TabList>
        {/* Tabs and tab-names */}
        <Tab>ChatGPT</Tab>
        <Tab>Topics</Tab>
        <Tab>Tab 3</Tab>
      </TabList>

      {/* Content for tabs */}

      {/* ChatGPT tab */}
      <TabPanel>
        <ChatMessages messages={messages} />
      </TabPanel>

      {/* Second tab */}
      <TabPanel>
        {" "}
        <TopicList
          onTopicClick={function (topic: string): void {
            throw new Error("Function not implemented.");
          }}
          link={link}
        />
      </TabPanel>

      {/* Third tab */}
      <TabPanel>{/* Place content for third tab here  */}</TabPanel>
    </Tabs>
  );
};

export default TabsComponent;
