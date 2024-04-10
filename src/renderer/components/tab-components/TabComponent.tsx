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
import { useTheme } from "@mui/material/styles";

interface TabInfo {
  key: string;
  label: string;
  shouldShow: boolean;
  component: React.ReactNode;
}

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: boolean;
  showTopicsTab: boolean;
  showFileSearchTab: boolean;
  showSentimentTab: boolean;
  showChatGPTTab: boolean;
  showParticipantsTab: boolean;
  activeTab: string | null;
  handleCloseTab: (tabType: string) => void;
  handleClearMessages: () => void;
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  activeTab,
  isLoading,
  showTopicsTab,
  showFileSearchTab,
  showSentimentTab,
  showChatGPTTab,
  showParticipantsTab,
  handleCloseTab,
  handleClearMessages,
}) => {
  const { selectedText } = useSelectedText();
  const { value, handleChange, setValue } = useTabs("1");

  // Logic for performing sentiment analysis
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const theme = useTheme();

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
    if (showChatGPTTab) setValue("1");
    else if (showTopicsTab) setValue("2");
    else if (showSentimentTab) setValue("3");
    else if (showParticipantsTab) setValue("4");
    else if (showFileSearchTab) setValue("7");
  }, [
    showChatGPTTab,
    showTopicsTab,
    showSentimentTab,
    showParticipantsTab,
    showFileSearchTab,
    setValue,
  ]);

  const tabs: TabInfo[] = [
    {
      key: "1",
      label: "ChatGPT",
      shouldShow: showChatGPTTab,
      component: (
        <GptTab
          link={activeTab}
          messages={messages}
          isLoading={isLoading}
          handleClearMessages={handleClearMessages}
        />
      ),
    },
    {
      key: "2",
      label: "Topics",
      shouldShow: showTopicsTab,
      component: <TopicsTab link={activeTab} />,
    },
    {
      key: "3",
      label: "Sentiment",
      shouldShow: showSentimentTab,
      component: (
        <SentimentTab
          link={activeTab}
          isAnalyzingSentiment={isAnalyzingSentiment}
        />
      ),
    },
    {
      key: "4",
      label: "Participants",
      shouldShow: showParticipantsTab,
      component: <ParticipantsTab link={activeTab} />,
    },
    {
      key: "7",
      label: "FileSearch",
      shouldShow: showFileSearchTab,
      component: <ControlFTab link={activeTab} />,
    },
  ];

  // Render each type of tab based on the boolean flags
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        {tabs.some((tab) => tab.shouldShow) && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              position: "sticky",
              top: -20,
              zIndex: 1100,
              background: theme.palette.mode === "light" ? "white" : "#242424",
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {tabs
                .filter((tab) => tab.shouldShow)
                .map(({ key, label }) => (
                  <Tab
                    key={key}
                    label={
                      <span>
                        {label}
                        <IconButton
                          size="small"
                          onClick={() => handleCloseTab(label)}
                          sx={{ marginLeft: "auto" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </span>
                    }
                    value={key}
                  />
                ))}
            </TabList>
          </Box>
        )}
        {tabs.every((tab) => !tab.shouldShow) && (
          <Box>
            <Box sx={{ textAlign: "center" }}>
              <h2>Instructions</h2>
            </Box>
            <p>
              This is an application designed to simplify the browsing of
              meeting files related to the TC39 committee. It aims to simplify
              tasks such as searching, navigating, and accessing specific
              information within the committee's documents.
            </p>
            <p>
              To begin, select a meeting file from the navigation bar. Once
              selected, you'll have several options. You can browse the file and
              utilize the features in the search bar for further inspection.
            </p>
            <p>
              <b>Participants</b> displays all meeting participants, allowing
              you to click on a name to view that person's comments.
            </p>
            <p>
              <b>Topics</b> showcases all topics discussed in the meeting,
              enabling you to click on them to automatically scroll to the
              corresponding section.
            </p>
            <p>
              <b>Sentiment</b> analyzes the tone of the conversation,
              categorizing it as positive, neutral, or negative.
            </p>
            <p>
              <b>Search with ChatGPT</b> allows you to search with ChatGPT as
              you would normally. Additionally, there are two pre-made prompts
              available below.
            </p>
            <p>
              <b>Search in file</b> enables you to perform a "Control F" search
              within the file as plain text.
            </p>
          </Box>
        )}
        {tabs
          .filter((tab) => tab.shouldShow)
          .map(({ key, component }) => (
            <TabPanel key={key} value={key}>
              {component}
            </TabPanel>
          ))}
      </TabContext>
    </Box>
  );
};
export default TabsComponent;
