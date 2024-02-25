import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ContextMenu = ({ x, y, isOpen, onAnalyzeSentiment, onClose }) => {
  // Ensure isOpen is always a boolean
  return (
    <Menu
      open={isOpen} // Use the passed isOpen prop for the open state
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: y, left: x }}
    >
      <MenuItem onClick={onAnalyzeSentiment}>Analyze Sentiment</MenuItem>
    </Menu>
  );
};

export default ContextMenu;
