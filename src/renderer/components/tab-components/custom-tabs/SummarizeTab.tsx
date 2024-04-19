import React from "react";
import ChatSummarize from "../../search-bar-components/chat-components/ChatSummarize";
import { extractFilename } from "../utils";

interface GptTabProps {
  link: string | null;
  messages: Message[];
  isLoading: boolean;
  handleClearMessages: () => void;
}

const SummarizeTab: React.FC<GptTabProps> = ({
  link,
  messages,
  isLoading,
  handleClearMessages,
}) => {
  return (
    <>
      <h3>{extractFilename(link, "gpt/summarize")}</h3>
      <ChatSummarize
        messages={messages}
        isLoading={isLoading}
        handleClearMessages={handleClearMessages}
      />
    </>
  );
};

export default SummarizeTab;
