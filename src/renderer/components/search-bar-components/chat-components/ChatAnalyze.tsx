import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

interface Message {
  role: "user" | "assistant";
  content: string;
  activeTab?: string | null;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  handleClearMessages: () => void;
}

const ChatAnalyze: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  handleClearMessages,
}) => {
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
      <Button
        style={{ marginLeft: "85%" }}
        variant="contained"
        color="primary"
        onClick={handleClearMessages}
      >
        Clear
      </Button>

      <Paper
        elevation={0}
        style={{
          padding: "5px",
          overflowY: "auto",
          height: "68vh",
          width: "105%",
          borderRadius: "10px",
          marginLeft: "-10px",
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
                  <p></p>
                  {`File: ${message.activeTab}`}
                </Typography>
              )}
              <Typography
                variant="body1"
                align="left"
                color={message.role === "user" ? "primary" : "success"}
                style={{ marginBottom: 20 }}
              >
                {" "}
                {processContent(message.content)}
              </Typography>
            </div>
          ))
        )}
      </Paper>
    </Grid>
  );
};

export default ChatAnalyze;
