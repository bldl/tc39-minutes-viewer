import React from "react";
import { Typography, Box } from "@mui/material";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

interface SentimentAnalysisDisplayProps {
  sentiment: string;
}

const SentimentAnalysisDisplay: React.FC<SentimentAnalysisDisplayProps> = ({
  sentiment,
}) => {
  let icon;
  switch (sentiment) {
    case "Positive":
      icon = <SentimentSatisfiedIcon color="success" />;
      break;
    case "Negative":
      icon = <SentimentDissatisfiedIcon color="error" />;
      break;
    case "Neutral":
    default:
      icon = <SentimentNeutralIcon color="action" />;
      break;
  }

  return (
    <Box sx={{ textAlign: "center", my: 2 }}>
      <Typography variant="h6">Overall Sentiment</Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {sentiment}
      </Typography>
      <Box sx={{ mt: 2 }}>{icon}</Box>
    </Box>
  );
};

export default SentimentAnalysisDisplay;
