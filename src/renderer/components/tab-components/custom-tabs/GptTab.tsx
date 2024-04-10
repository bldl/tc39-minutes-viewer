import React from "react";
import ChatMessages from "../../search-bar-components/chat-components/ChatMessages";
import { extractFilename } from "../utils";

interface GptTabProps {
  link: string | null;
  messages: Message[];
  isLoading: boolean;
}

const GptTab: React.FC<GptTabProps> = ({ link, messages, isLoading }) => {
  return (
    <>
      <h3>{extractFilename(link, "gpt")}</h3>
      <ChatMessages messages={messages} isLoading={isLoading} />
    </>
  );
};

export default GptTab;
