import React from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import useTabs from "./useTabs.ts";
import { extractFilename, toSlug, useScrollToSection } from "./utils.ts";

import ChatMessages from "../chat-components/ChatMessages.tsx";
import TopicList from "./topics/ExtractingAllHeaders.tsx";
import Delegates from "./delegates/Delegates.tsx";
import SentimentAnalysisComponent from "./sentiment-analysis/SentimentAnalysisComponent.tsx";

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: true | false;
  showTopicsTab: boolean;
  showSentimentTab: boolean;
  showGptTab: boolean;
  showParticipantsTab: boolean;
  activeTab: string | null;
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  activeTab,
  isLoading,
  showTopicsTab,
  showSentimentTab,
  showGptTab,
  showParticipantsTab,
}) => {
  const scrollToSection = useScrollToSection();
  const { value, handleChange } = useTabs(
    showGptTab
      ? "1"
      : showTopicsTab
      ? "2"
      : showSentimentTab
      ? "3"
      : showParticipantsTab
      ? "4"
      : "1"
  );

  return showGptTab ||
    showTopicsTab ||
    showSentimentTab ||
    showParticipantsTab ? (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              "& .MuiTab-root:focus": {
                outline: "none",
                // You can add additional styles for the focused state here
              },
              "& .MuiTab-root.Mui-selected": {
                // Styles for the selected tab
              },
            }}
          >
            {showGptTab && <Tab label="ChatGPT" value="1" />}
            {showTopicsTab && <Tab label="Topics" value="2" />}
            {showSentimentTab && <Tab label="Sentiment" value="3" />}
            {showParticipantsTab && <Tab label="Persons" value="4" />}
          </TabList>
        </Box>
        {showGptTab && (
          <TabPanel value="1">
            <h3>{extractFilename(activeTab, "gpt")}</h3>
            <ChatMessages messages={messages} isLoading={isLoading} />
          </TabPanel>
        )}
        {showTopicsTab && (
          <TabPanel value="2">
            <h3>{extractFilename(activeTab, "topics")}</h3>{" "}
            <TopicList
              onTopicClick={function (topic: string): void {
                scrollToSection(toSlug(topic), topic);
              }}
              link={activeTab}
            />
          </TabPanel>
        )}
        {showSentimentTab && (
          <TabPanel value="3">
            <h3>{extractFilename(activeTab, "sentiment")}</h3>
            <SentimentAnalysisComponent link={activeTab} />
          </TabPanel>
        )}
        {showParticipantsTab && (
          <TabPanel value="4">
            <h3>{extractFilename(activeTab, "persons")}</h3>
            <Delegates link={activeTab} />
          </TabPanel>
        )}
      </TabContext>
    </Box>
  ) : (
    // Render a message or an empty fragment when no tabs are available
    <Box sx={{ width: "100%", typography: "body1" }}>
      <h2>Here we can add instructions for the app. </h2>
    </Box>
  );
};

export default TabsComponent;
