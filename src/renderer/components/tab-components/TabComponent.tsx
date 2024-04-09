import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import useTabs from "./useTabs";
import { useSelectedText } from "../contexts/SelectedTextContext";

// Import components
import GptTab from "./custom-tabs/GptTab";
import TopicsTab from "./custom-tabs/TopicsTab";
import SentimentTab from "./custom-tabs/SentimentTab";
import ParticipantsTab from "./custom-tabs/ParticipantsTab";
import ControlFTab from "./custom-tabs/ControlFTab";

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: boolean;
  showTopicsTab: boolean;
  showControlFTab: boolean;
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
  showControlFTab,
  showSentimentTab,
  showGptTab,
  showParticipantsTab,
  handleCloseTab,
}) => {
  const { selectedText } = useSelectedText();
  const { value, handleChange, setValue } = useTabs("1");

  // Logic for performing sentiment analysis
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);

  const performSentimentAnalysis = (textToAnalyze: string) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once("sentimentAnalysisResult", (_event, result) => {
        resolve(result);
      });

      ipcRenderer.once("sentimentAnalysisError", (_event, error) => {
        reject(error);
      });

      ipcRenderer.send("performSentimentAnalysis", textToAnalyze);
    });
  };

  useEffect(() => {
    const analyzeSentiment = async () => {
      if (showSentimentTab && selectedText) {
        setIsAnalyzingSentiment(true);
        try {
          await performSentimentAnalysis(selectedText);
        } catch (error) {
          console.error("Sentiment analysis failed", error);
        } finally {
          setIsAnalyzingSentiment(false);
        }
      }
    };

    analyzeSentiment();
  }, [showSentimentTab, selectedText]);

  // Setting the initial value of the tab based on the props
  useEffect(() => {
    if (showGptTab) setValue("1");
    else if (showTopicsTab) setValue("2");
    else if (showSentimentTab) setValue("3");
    else if (showParticipantsTab) setValue("4");
    else if (showControlFTab) setValue("7");
  }, [
    showGptTab,
    showTopicsTab,
    showSentimentTab,
    showParticipantsTab,
    showControlFTab,
    setValue,
  ]);

  // Render each type of tab based on the boolean flags
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            position: "sticky",
            top: -20,
            zIndex: 1100,
          }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {showGptTab && (
              <Tab
                label={
                  <span>
                    ChatGpt
                    <IconButton
                      size="small"
                      onClick={() => handleCloseTab("Gpt")}
                      sx={{ marginLeft: "auto" }}
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
                      onClick={() => handleCloseTab("Topics")}
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
                      onClick={() => handleCloseTab("Sentiment")}
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
                      onClick={() => handleCloseTab("Participants")}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                }
                value="4"
              />
            )}
            {showControlFTab && (
              <Tab
                label={
                  <span>
                    File Search
                    <IconButton
                      size="small"
                      onClick={() => handleCloseTab("ControlF")}
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
            <GptTab
              link={activeTab}
              messages={messages}
              isLoading={isLoading}
            />
          </TabPanel>
        )}
        {showTopicsTab && (
          <TabPanel value="2">
            <TopicsTab link={activeTab} />
          </TabPanel>
        )}
        {showSentimentTab && (
          <TabPanel value="3">
            <SentimentTab
              link={activeTab}
              isAnalyzingSentiment={isAnalyzingSentiment}
            />
          </TabPanel>
        )}
        {showParticipantsTab && (
          <TabPanel value="4">
            <ParticipantsTab link={activeTab} />
          </TabPanel>
        )}
        {showControlFTab && (
          <TabPanel value="7">
            <ControlFTab link={activeTab} />
          </TabPanel>
        )}
      </TabContext>
    </Box>
  );
};
export default TabsComponent;
