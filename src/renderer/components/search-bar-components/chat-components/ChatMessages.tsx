import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

interface Message {
  role: "user" | "assistant";
  content: string;
  activeTab?: string | null;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const processContent = (content: string): JSX.Element => {
    // Replace each "-" with a newline ("\n") followed by "-"
    const updatedContent = content.replace(/-/g, "-");
    // Splitting the updated content by new lines to wrap each line in a span for correct rendering
    return (
      <>
        {updatedContent.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Grid item xs={6}>
      <Divider orientation="vertical" flexItem />
      <Paper
        elevation={0}
        style={{
          padding: "5px",
          overflowY: "auto",
          height: "68vh",
          width: "105%",
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
          messages.map((message, index) => (
            <div key={index}>
              {message.activeTab && (
                <Typography align="left" style={{ fontWeight: "bold" }}>
                  {`File: ${message.activeTab}`}
                </Typography>
              )}
              <Typography
                variant="body1"
                align="left"
                color={message.role === "user" ? "primary" : "success"}
                style={{ marginBottom: 20 }}
              >
                {/* Process and display content */}
                {processContent(message.content)}
              </Typography>
            </div>
          ))
        )}
      </Paper>
    </Grid>
  );
};

export default ChatMessages;
