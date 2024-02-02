import React from "react";
import { Grid, Paper, Typography, Divider } from "@mui/material";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
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
        }}
      >

        {messages.map((message, index) => (
          <Typography
            key={index}
            variant="body1"
            align="left"
            color={message.role === "user" ? "primary" : "success"}
          >
            {message.content}
          </Typography>
        ))}
      </Paper>
    </Grid>
  );
};

export default ChatMessages;
