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
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <Grid item xs={6}>
      <Divider orientation="vertical" flexItem />
      <Paper
        elevation={0}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "68vh",
          width: "192%",
          borderRadius: "20px",
        }}
      >
        {isLoading ? ( // Conditional rendering based on isLoading
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
            <Typography
              key={index}
              variant="body1"
              align="left"
              color={message.role === "user" ? "primary" : "success"}
            >
              {message.content}
            </Typography>
          ))
        )}
      </Paper>
    </Grid>
  );
};
export default ChatMessages;
