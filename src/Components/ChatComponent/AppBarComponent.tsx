import React from "react";
import { AppBar, Toolbar, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface AppBarComponentProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleClearMessages: () => void;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleClearMessages,
}) => {
  return (
    <AppBar
      position="static"
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "10px",
        marginLeft: "10%",
        width: "88%",
      }}
    >
      <Toolbar>
        <InputBase
          placeholder="What do you want to know?"
          inputProps={{ "aria-label": "type your message" }}
          value={input}
          onChange={handleInputChange}
          style={{
            borderRadius: "20px",
            padding: "10px",
            color: "black",
            flex: 1,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          <SearchIcon></SearchIcon>
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClearMessages}
        >
          Clear
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
