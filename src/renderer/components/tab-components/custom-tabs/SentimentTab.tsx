import React from "react";
import SentimentAnalysisComponent from "../sentiment-analysis/SentimentAnalysisComponent";

interface SentimentTabProps {
  link: string | null;
  isAnalyzingSentiment: boolean;
}

const SentimentTab: React.FC<SentimentTabProps> = ({ link, isAnalyzingSentiment }) => {
  return (
    <>
      <h3>{`Sentiment Analysis for ${link}`}</h3>
      <SentimentAnalysisComponent
        link={link}
        isAnalyzingSentiment={isAnalyzingSentiment}
      />
    </>
  );
};

export default SentimentTab;

