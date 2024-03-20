import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { annotate } from "rough-notation";

import ChatMessages from "../ChatComponent/ChatMessages";
import TopicList from "./ExtractingAllHeaders";
import Delegates from "./Delegates.tsx";
import SentimentAnalysisComponent from "./Sentiment/SentimentAnalysisComponent";

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
  showGptTab,
  showSentimentTab,
  showParticipantsTab,
}: TabBoxProps) => {
  const [lastTopicClick, setLastTopicClick] = useState<{
    topic: string;
    time: number;
  }>({
    topic: "",
    time: 0,
  });
  const [value, setValue] = useState(
    showGptTab
      ? "1"
      : showTopicsTab
      ? "2"
      : showSentimentTab
      ? "3"
      : showParticipantsTab
      ? "4"
      : ""
  );

  const handleChange = (
    _event: any,
    newValue: React.SetStateAction<string>
  ) => {
    setValue(newValue);
  };

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

  const extractFilename = (
    link: string | null,
    type: "topics" | "sentiment" | "persons" | "gpt"
  ): string => {
    if (!link) return "";

    // Normalize backslashes to forward slashes for consistency
    const normalizedLink = link.replace(/\\/g, "/");

    // Extract the part after 'public/meetings/'
    const pattern = /public\/meetings\/(.*)/;
    const match = normalizedLink.match(pattern);
    if (!match) return "Invalid link format";

    // Extracted filename will be something like '2019-03/26.md'
    let [yearMonth, dayWithExtension] = match[1].split("/");
    if (!dayWithExtension) return "Invalid link format";

    // Split the year and month, and remove the '.md' extension from day
    let [year, month] = yearMonth.split("-");

    //remove also the .md from the day and letters
    let part = dayWithExtension.replace(".md", "");
    let day = part.replace(/[a-zA-Z--]/g, "");

    // Reconstruct the URL with the type
    const reconstructedUrl = `http://tc39/${year}/${month}/${day}/${type}`;

    return reconstructedUrl;
  };

  const scrollToSection = (id: string, topic: string) => {
    const currentTime = new Date().getTime();
    console.log("Clicked on topic in scroll:", topic);
    console.log("Id:", id);
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

    console.log("Element:", element);

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
      color: "red",
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

  function toSlug(text: string): string {
    // Normalize Unicode characters, remove non-alphanumeric characters, replace spaces with hyphens
    // This approach assumes a basic handling of special characters and may need adjustments for edge cases
    return text
      .normalize("NFD") // Decompose Unicode into base characters and diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase() // Convert to lowercase
      .replace(/&/g, "")
      .replace(/:=/g, "-")
      .replace(/"/g, "-")
      .replace(/[\s]+/g, "-") // Replace spaces and repeated hyphens with a single hyphen
      .replace(/[^a-z0-9\-]/g, "") // Remove remaining non-alphanumeric/non-hyphen characters
      .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, "") // Trim hyphens from start and end
      .replace(/""/g, ""); // Handle ':=' by removing it
  }

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
