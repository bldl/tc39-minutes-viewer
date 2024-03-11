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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

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
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  link,
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

  const SentimentAnalysisChart = ({ sentimentResults }) => {
    const data = [
      {
        name: "Negative",
        count: sentimentResults.filter((x) => x === "Negative").length,
      },
      {
        name: "Neutral",
        count: sentimentResults.filter((x) => x === "Neutral").length,
      },
      {
        name: "Positive",
        count: sentimentResults.filter((x) => x === "Positive").length,
      },
    ];

    return (
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    );
  };

  const SentimentPieChart = ({ sentimentResults }) => {
    const data = [
      {
        name: "Negative",
        value: sentimentResults.filter((x) => x === "Negative").length,
      },
      {
        name: "Neutral",
        value: sentimentResults.filter((x) => x === "Neutral").length,
      },
      {
        name: "Positive",
        value: sentimentResults.filter((x) => x === "Positive").length,
      },
    ];

    const COLORS = ["#FF8042", "#00C49F", "#0088FE"];

    return (
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    );
  };

  const SentimentLineChart = ({ sentimentResults }) => {
    // Mapping sentiment strings to numeric values for visualization
    const data = sentimentResults.map((sentiment, index) => ({
      name: `Point ${index + 1}`,
      Sentiment: sentiment === "Positive" ? 2 : sentiment === "Neutral" ? 1 : 0,
    }));

    return (
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 2]} allowDataOverflow={true} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Sentiment" stroke="#8884d8" />
      </LineChart>
    );
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload,
  }) => {
    if (percent < 0.05) return null; // Don't render labels for very small segments

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${payload.name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  // State to manage selected chart type
  const [chartType, setChartType] = useState("bar");

  // Handler for chart type change
  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
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

  function toSlug(topic: string): string {
    return topic
      .toLowerCase() // Convert to lowercase
      .replace(/[\s]+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+/, "") // Trim hyphen from start
      .replace(/-+$/, ""); // Trim hyphen from end
  }

  const handlePerosnClick = (person: string) => {
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
            <ChatMessages messages={messages} isLoading={isLoading} />
          </TabPanel>
        )}
        {showTopicsTab && (
          <TabPanel value="2">
            {" "}
            <TopicList
              onTopicClick={function (topic: string): void {
                scrollToSection(toSlug(topic), topic);
              }}
              link={link}
            />
          </TabPanel>
        )}
        {showSentimentTab && (
          <TabPanel value="3">
            <h2>Sentiment Analysis</h2>
            <ToggleButtonGroup
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
            </ToggleButtonGroup>
            {sentimentResult.length > 0 ? (
              chartType === "bar" ? (
                <SentimentAnalysisChart sentimentResults={sentimentResult} />
              ) : chartType === "pie" ? (
                <SentimentPieChart sentimentResults={sentimentResult} />
              ) : (
                <SentimentLineChart sentimentResults={sentimentResult} />
              )
            ) : (
              <p>No sentiment analysis has been performed yet.</p>
            )}
          </TabPanel>
        )}
      </TabContext>
    </Box>
  ) : (
    // Render a message or an empty fragment when no tabs are available
    <Box sx={{ width: "100%", typography: "body1" }}>
      <h2>No tab is selected.</h2>
    </Box>
  );
};

export default TabsComponent;
