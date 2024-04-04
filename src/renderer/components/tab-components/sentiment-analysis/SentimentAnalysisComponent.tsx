import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ChartToggleButtons from "./utils/charts/ChartToggleButtons";
import SentimentAnalysisDisplay from "./utils/SentimentAnalysisDisplay";
import SentimentBarChart from "./utils/charts/SentimentBarChart";
import SentimentPieChart from "./utils/charts/SentimentPieChart";
import SentimentLineChart from "./utils/charts/SentimentLineChart";
import CircularProgress from "@mui/material/CircularProgress";

interface SentimentAnalysisComponentProps {
  link: string | null;
  isAnalyzingSentiment: boolean;
}

const SentimentAnalysisComponent: React.FC<SentimentAnalysisComponentProps> = ({
  link,
  isAnalyzingSentiment,
}) => {
  const [sentimentResult, setSentimentResult] = useState<string[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<string>("");
  const [chartType, setChartType] = useState("pie");

  // Convert sentiment analysis numeric result to a descriptive message
  type SentimentScore = "0" | "1" | "2";
  const interpretSentiment = (score: SentimentScore) => {
    const sentimentMap: { [key in SentimentScore]: string } = {
      "0": "Negative",
      "1": "Neutral",
      "2": "Positive",
    };

    return sentimentMap[score] || "Unknown";
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

  useEffect(() => {
    if (!link) return;
    window.api.receiveSentimentAnalysis((_event: any, arg: string) => {
      const scores = JSON.parse(arg);
      const sentimentDescriptions = scores.map(interpretSentiment);
      setSentimentResult(sentimentDescriptions);

      const overall = interpretOverallSentiment(scores);
      setOverallSentiment(overall);
    });
  }, [link]);

  return (
    <Box>
      <h3>{link && `Sentiment Analysis for ${link}`}</h3>
      {isAnalyzingSentiment ? (
        // Display loading indicator and text only while analyzing sentiment
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
          }}
        >
          <CircularProgress size={50} />
          <Typography sx={{ mt: 2 }}>
            Generating sentiment analysis...
          </Typography>
        </Box>
      ) : sentimentResult.length > 0 ? (
        // Display charts and analysis display after sentiment analysis is complete
        <>
          <SentimentAnalysisDisplay sentiment={overallSentiment} />
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
        // Display message if no analysis has been performed
        <Typography sx={{ textAlign: "center", marginTop: 2 }}>
          No sentiment analysis has been performed yet.
        </Typography>
      )}
    </Box>
  );
};

export default SentimentAnalysisComponent;
