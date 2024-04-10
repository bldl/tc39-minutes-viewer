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
  showFileSearchTab,
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

  const tabs: TabInfo[] = [
    {
      key: "1",
      label: "Gpt",
      shouldShow: showGptTab,
      component: (
        <GptTab link={activeTab} messages={messages} isLoading={isLoading} />
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
      label: "Persons",
      shouldShow: showParticipantsTab,
      component: <ParticipantsTab link={activeTab} />,
    },
    {
      key: "7",
      label: "ControlF",
      shouldShow: showControlFTab,
      component: <ControlFTab link={activeTab} />,
    },
  ];

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
