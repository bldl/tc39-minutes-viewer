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

const ChatSummarize: React.FC<ChatMessagesProps> = ({ messages, isLoading, handleClearMessages }) => {

  return (
    <Grid item xs={6}>
      <Divider orientation="vertical" flexItem />
      <Button style={{ marginLeft: "85%" }} variant="contained" color="primary" onClick={handleClearMessages}>
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
                {message.content}
              </Typography>
            </div>
          ))
        )}
      </Paper>
    </Grid>
  );
};

export default ChatSummarize;
