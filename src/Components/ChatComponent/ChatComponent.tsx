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
}

// ChatComponent is the main component for the chat interface.
const ChatComponent: React.FC<ChatComponentProps> = ({
  link = "../public/meetings/2012-05/may-21.md",
}) => {
  // State variables for the chat component.
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clearMessages, setClearMessages] = useState<boolean>(false);

  const [highlightedText, setHighlightedText] = useState<string>("");

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
      />
      <Grid container spacing={1} style={{ marginTop: "10px" }}>
        <LeftBoxContent link={link} onHighlight={handleHighlightedText} />

        <Grid item xs={6}>
          <Divider orientation="vertical" flexItem />
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              overflowY: "auto",
              height: "77vh",
              width: "37.8vw",
              maxWidth: "100%",
              borderRadius: "20px",
            }}
          >
            <TabsComponent
              messages={messages}
              link={link}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatComponent;
