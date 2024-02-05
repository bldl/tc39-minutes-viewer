import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import AppBarComponent from "./AppBarComponent"; // Importing the AppBarComponent
import LeftBoxContent from "../LeftBox/LeftBoxContent"; // Assuming LeftBoxContent is already a separate component
import TabsComponent from "../TabComponent/TabComponent";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clearMessages, setClearMessages] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  {
    /* Clear messages when clearMessages is true */
  }
  const handleClearMessages = () => {
    setIsLoading(false);
    setMessages([]);
    setClearMessages(true);
  };

  {
    /* Clear messages when clearMessages is true */
  }
  useEffect(() => {
    if (clearMessages) {
      setClearMessages(false);
    }
  }, [clearMessages]);

  {
    /* Send message to the assistant */
  }
  const handleSendMessage = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false); // Stop loading regardless of success or error
    }
  };

  return (
    <Container style={{ maxWidth: "none", marginLeft: "17.5%" }}>
      <AppBarComponent
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleClearMessages={handleClearMessages}
      />
      <Grid container spacing={1} style={{ marginTop: "10px" }}>
        <LeftBoxContent link={link} />

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
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <TabsComponent messages={messages} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatComponent;
