import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ChatMessages from "../ChatComponent/ChatMessages";
import TopicList from "./ExtractingAllHeaders";
import { annotate } from "rough-notation";
import ExtractAllPeople from "./ExtractAllPeople.tsx";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Typography } from "@mui/material";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

import SentimentBarChart from "./Sentiment/SentimentBarChart";
import SentimentPieChart from "./Sentiment/SentimentPieChart";
import SentimentLineChart from "./Sentiment/SentimentLineChart";

// Styled ToggleButtonGroup for better alignment and spacing
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex",
  justifyContent: "center", // Ensure the buttons are centered
  marginBottom: theme.spacing(2), // Add some space below the buttons
}));

const getSentimentIcon = (sentiment) => {
  if (sentiment.includes("Negative")) {
    return <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 40 }} />;
  } else if (sentiment.includes("Positive")) {
    return <SentimentSatisfiedIcon color="success" sx={{ fontSize: 40 }} />;
  } else if (sentiment.includes("Neutral")) {
    return <SentimentNeutralIcon color="action" sx={{ fontSize: 40 }} />;
  }
};
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

  const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
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

  const extractFilename = (
    link: string | null,
    type: "topics" | "sentiment" | "persons" | "gpt"
  ): string => {
    if (!link) return "No file selected";

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

  // State to manage selected chart type
  const [chartType, setChartType] = useState("pie");

  // Handler for chart type change
  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };
  // Sentiment end

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

  const handlePerosnClick = (person: string) => {
    console.log("Clicked on person:", person);
    scrollToSection(toSlug(person), person);
  };

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
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <StyledToggleButtonGroup
                color="primary"
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                aria-label="chart type"
              >
                <ToggleButton value="bar" aria-label="bar chart">
                  Bar Chart
                </ToggleButton>
                <ToggleButton value="pie" aria-label="pie chart">
                  Pie Chart
                </ToggleButton>
                <ToggleButton value="line" aria-label="line chart">
                  Line Chart
                </ToggleButton>
              </StyledToggleButtonGroup>
            </Box>
            {sentimentResult.length > 0 ? (
              <>
                <Box sx={{ textAlign: "center", my: 2 }}>
                  <Typography variant="h6">Overall Sentiment</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {overallSentiment}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    {getSentimentIcon(overallSentiment)}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  {chartType === "bar" && (
                    <SentimentBarChart sentimentResults={sentimentResult} />
                  )}
                  {chartType === "pie" && (
                    <SentimentPieChart sentimentResults={sentimentResult} />
                  )}
                  {chartType === "line" && (
                    <SentimentLineChart sentimentResults={sentimentResult} />
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", my: 2 }}>
                <SentimentNeutralIcon sx={{ fontSize: 40, my: 2 }} />
                <Typography>
                  No sentiment analysis has been performed yet.
                </Typography>
              </Box>
            )}
          </TabPanel>
        )}
        {showParticipantsTab && (
          <TabPanel value="4">
            <h3>{extractFilename(activeTab, "persons")}</h3>
            <ExtractAllPeople
              link={activeTab}
              onPersonClick={(person) => handlePerosnClick(person)}
            />
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
