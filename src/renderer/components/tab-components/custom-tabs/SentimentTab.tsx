import React from "react";
import SentimentAnalysisComponent from "../sentiment-analysis/SentimentAnalysisComponent";
import { extractFilename } from "../utils";

interface SentimentTabProps {
  link: string | null;
  isAnalyzingSentiment: boolean;
}

const SentimentTab: React.FC<SentimentTabProps> = ({
  link,
  isAnalyzingSentiment,
}) => {
  return (
    <>
      <h3>{extractFilename(link, "sentiment")}</h3>
      <SentimentAnalysisComponent
        link={link}
        isAnalyzingSentiment={isAnalyzingSentiment}
      />
    </>
  );
};

export default SentimentTab;
