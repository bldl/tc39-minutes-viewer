import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid } from "@mui/material";
import AppBarComponent from "./AppBarComponent"; // Importing the AppBarComponent
import ChatMessages from "./ChatMessages"; // Importing the ChatMessages component
import LeftBoxContent from "../LeftBox/LeftBoxContent"; // Assuming LeftBoxContent is already a separate component

// Define the shape of the message object
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatComponentProps {
  link: string | null;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  link = "../public/meetings/2012-05/may-21.md",
}) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [clearMessages, setClearMessages] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleClearMessages = () => {
    setMessages([]);
    setClearMessages(true);
  };

  useEffect(() => {
    if (clearMessages) {
      setClearMessages(false);
    }
  }, [clearMessages]);

  const handleSendMessage = async () => {
    const modelName = "gpt-3.5-turbo";
    const maxTokens = 200;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input },
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

      setMessages([
        ...messages,
        {
          role: "assistant",
          content: response.data.choices[0].message.content,
        },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Container style={{ maxWidth: "none" }}>
      <AppBarComponent
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleClearMessages={handleClearMessages}
      />
      <Grid container spacing={1} style={{ marginTop: "10px" } }>
        <LeftBoxContent link={link} />
        <ChatMessages messages={messages} />
      </Grid>
    </Container>
  );
};

export default ChatComponent;
