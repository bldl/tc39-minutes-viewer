import React from "react";
import ChatAnalyze from "../../search-bar-components/chat-components/ChatAnalyze";
import { extractFilename } from "../utils";

interface GptTabProps {
  link: string | null;
  messages: Message[];
  isLoading: boolean;
  handleClearMessages: () => void;
}

const AnalyzeTab: React.FC<GptTabProps> = ({
  link,
  messages,
  isLoading,
  handleClearMessages,
}) => {
  return (
    <>
      <h3>{extractFilename(link, "gpt/analyze")}</h3>
      <ChatAnalyze
        messages={messages}
        isLoading={isLoading}
        handleClearMessages={handleClearMessages}
      />
    </>
  );
};

export default AnalyzeTab;
