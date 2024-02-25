import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt"; // Example icon
import { Divider } from "@mui/material";

const ContextMenu = ({ x, y, isOpen, onAnalyzeSentiment, onClose }) => {
  // Example of custom styling (optional)
  // You can further customize the style using MUI's theme in a real app
  return (
    <Menu
      open={isOpen}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={isOpen ? { top: y, left: x } : undefined}
    >
      <MenuItem onClick={onAnalyzeSentiment}>
        <ListItemIcon>
          <SentimentSatisfiedAltIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Analyze Sentiment</ListItemText>
      </MenuItem>
      {/* Divider */}
      <Divider />
      {/* Additional MenuItems go here */}
    </Menu>
  );
};

export default ContextMenu;
