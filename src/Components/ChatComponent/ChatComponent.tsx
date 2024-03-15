import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Divider, Grid, Paper } from "@mui/material";
import AppBarComponent from "./AppBarComponent"; // Importing the AppBarComponent
import LeftBoxContent from "../LeftBox/LeftBoxContent"; // Assuming LeftBoxContent is already a separate component
import TabsComponent from "../TabComponent/TabComponent"; // Assuming TabsComponent is already a separate component

// Define the shape of the message object
interface Message {
  role: "user" | "assistant";
  content: string;
}

// Props for the ChatComponent.
interface ChatComponentProps {
  link: string | null;
  isLoading: true | false;
  updateFilePath: (filePath: string) => void;
}

// ChatComponent is the main component for the chat interface.
const ChatComponent: React.FC<ChatComponentProps> = ({
  link = "../public/meetings/2012-05/may-21.md",
  updateFilePath,
}) => {
  // State variables for the chat component.
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clearMessages, setClearMessages] = useState<boolean>(false);

  const [highlightedText, setHighlightedText] = useState<string>("");
  const [showTopicsTab, setShowTopicsTab] = useState(false);
  const [showSentimentTab, setShowSentimentTab] = useState(false);
  const [showGptTab, setShowGptTab] = useState(false);
  const [showPersonsTab, setShowPersonsTab] = useState(false);

  const handleHighlightedText = (text: string) => {
    setHighlightedText(text);
  };
  // Handles changes in the chat input field.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  {
    // Clears all messages from the chat.
  }
  const handleClearMessages = () => {
    setIsLoading(false);
    setMessages([]);
    setClearMessages(true);
  };

  const handleSelectOption = (selectedOption: string) => {
    if (selectedOption === "Topics") {
      setShowTopicsTab(true);
    } else if (selectedOption === "Sentiment") {
      setShowSentimentTab(true);
    } else if (selectedOption === "Search with GPT-3.5") {
      setShowGptTab(true);
    } else if (selectedOption === "Persons") {
      setShowPersonsTab(true);
    }
    // Add more conditions for other choices as needed
  };

  {
    // Effect to reset the clearMessages flag.
  }
  useEffect(() => {
    if (clearMessages) {
      setClearMessages(false);
    }
  }, [clearMessages]);

  {
    // Handles sending a message to the chatbot.
  }
  const handleSendMessage = async () => {
    setIsLoading(true);
    const modelName = "gpt-3.5-turbo";
    const maxTokens = 200;

    try {
      // Making a POST request to the OpenAI API.
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `${input}\n\nHighlighted Text: ${highlightedText}`,
            },
          ],
          model: modelName,
          max_tokens: maxTokens,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_REACT_APP_OPENAI_API_KEY
            }`,
          },
        }
      );
      // Updating the messages state with the response.
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: response.data.choices[0].message.content,
        },
      ]);
      setInput("");
      setHighlightedText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or error
    }
  };

  // Render the chat component UI.
  return (
    <Container style={{ maxWidth: "none", marginLeft: "17.5%" }}>
      <AppBarComponent
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleClearMessages={handleClearMessages}
        handleSelectOption={handleSelectOption}
        updateFilePath={updateFilePath}
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <LeftBoxContent link={link} onHighlight={handleHighlightedText} />

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "80vh",
            width: "40vw",
            maxWidth: "100%",
            borderRadius: "20px",
            flexShrink: 1, // Allow the right box to shrink
          }}
        >
          <TabsComponent
            messages={messages}
            link={link}
            isLoading={isLoading}
            showTopicsTab={showTopicsTab}
            showSentimentTab={showSentimentTab}
            showGptTab={showGptTab}
            showParticipantsTab={showPersonsTab}
          />
        </Paper>
      </div>
    </Container>
  );
};

export default ChatComponent;
