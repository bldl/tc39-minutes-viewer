import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import useTabs from "./useTabs.ts";
import { extractFilename, toSlug, useScrollToSection } from "./utils.ts";

import ChatMessages from "../chat-components/ChatMessages.tsx";
import TopicList from "./topics/ExtractingAllHeaders.tsx";
import Delegates from "./delegates/Delegates.tsx";
import SentimentAnalysisComponent from "./sentiment-analysis/SentimentAnalysisComponent.tsx";
import { useSelectedText } from "../SelectedTextContext";

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: true | false;
  showTopicsTab: boolean;
  showSentimentTab: boolean;
  showGptTab: boolean;
  showParticipantsTab: boolean;
  activeTab: string | null;

  handleCloseTab: (tabType: string) => void;
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  activeTab,
  isLoading,
  showTopicsTab,
  showSentimentTab,
  showGptTab,
  showParticipantsTab,
  handleCloseTab,
}: TabBoxProps) => {
  const scrollToSection = useScrollToSection();
  const { value, handleChange, setValue } = useTabs(
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

  const { selectedText } = useSelectedText();

  useEffect(() => {
    // Function to perform sentiment analysis
    const analyzeSentiment = async () => {
      if (showSentimentTab && selectedText) {
        try {
          // Assuming you have a method to perform sentiment analysis
          // This could be calling an API endpoint, or another function that handles the analysis
          const analysisResult = await window.api.performSentimentAnalysis(
            selectedText
          );
          // Process the analysisResult here
          console.log(analysisResult);
        } catch (error) {
          console.error("Failed to perform sentiment analysis:", error);
        }
      }
    };

    // Call the analyzeSentiment function when the component mounts or when showSentimentTab/selectedText changes
    analyzeSentiment();
  }, [showSentimentTab, selectedText]); // This effect depends on showSentimentTab and selectedText

  useEffect(() => {
    // When the component mounts or when the conditions of the tabs change,
    // set the value to the first available tab.
    if (showGptTab) {
      setValue("1");
    } else if (showTopicsTab) {
      setValue("2");
    } else if (showSentimentTab) {
      setValue("3");
    } else if (showParticipantsTab) {
      setValue("4");
    }
  }, [showGptTab, showTopicsTab, showSentimentTab, showParticipantsTab]);

  return showGptTab ||
    showTopicsTab ||
    showSentimentTab ||
    showParticipantsTab ? (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            position: "sticky",
            top: -20,
            zIndex: 1100, // Ensure it stays above other content
            backgroundColor: "white", // Or any other color, to ensure text readability
          }}
        >
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
            {showGptTab && (
              <Tab
                label={
                  <span>
                    ChatGpt
                    <IconButton
                      size="small"
                      component="span"
                      onClick={() => handleCloseTab("Gpt")}
                      style={{ marginLeft: "auto" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                }
                value="1"
              />
            )}

            {showTopicsTab && (
              <Tab
                label={
                  <span>
                    Topics
                    <IconButton
                      size="small"
                      component="span"
                      onClick={() => handleCloseTab("Topics")}
                      style={{ marginLeft: "auto" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                }
                value="2"
              />
            )}

            {showSentimentTab && (
              <Tab
                label={
                  <span>
                    Sentiment
                    <IconButton
                      size="small"
                      component="span"
                      onClick={() => handleCloseTab("Sentiment")}
                      style={{ marginLeft: "auto" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                }
                value="3"
              />
            )}
            {showParticipantsTab && (
              <Tab
                label={
                  <span>
                    Participants
                    <IconButton
                      size="small"
                      component="span"
                      onClick={() => handleCloseTab("Persons")}
                      style={{ marginLeft: "auto" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                }
                value="4"
              />
            )}
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
