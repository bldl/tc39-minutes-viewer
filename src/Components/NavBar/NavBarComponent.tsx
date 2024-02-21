import React, { useState } from "react";
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"; // Corrected
import CheckBoxIcon from "@mui/icons-material/CheckBox"; // Added

interface NavBarComponentProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
  onSelectYear: (year: string) => void;
  onSelectMonth: (year: string, month: string) => void;
  onSelectDay: (filePath: string) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  hashTable,
  onSelectYear,
  onSelectMonth,
  onSelectDay,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length > 0 ? [] : Object.keys(hashTable)
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length > 0 ? [] : Object.keys(hashTable)
    );
  };
  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const parts = nodeId.split("-");
    if (parts.length === 1) {
      onSelectYear(parts[0]);
    } else if (parts.length === 2) {
      onSelectMonth(parts[0], parts[1]);
    } else if (parts.length === 3) {
      onSelectDay(hashTable[parts[0]][parts[1]][parts[2]]);
    }
  };
  const renderTreeItems = (
    data: Record<string, any>,
    prefix = ""
  ): JSX.Element[] => {
    return Object.keys(data).map((key) => {
      const newPrefix = prefix ? `${prefix}-${key}` : key;
      if (typeof data[key] === "object") {
        return (
          <TreeItem key={newPrefix} nodeId={newPrefix} label={key}>
            {renderTreeItems(data[key], newPrefix)}
          </TreeItem>
        );
      }
      return <TreeItem key={newPrefix} nodeId={newPrefix} label={key} />;
    });
  };

  return (
    <Grid item xs={12} style={{ position: "relative" }}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "90.2vh",
          width: "15%",
          position: "absolute",
          top: "10%",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Button
            onClick={handleExpandClick}
            size="small"
            variant="text"
            sx={{
              color: "grey.900",
              padding: "2px 2px", // Reduced padding
              minWidth: "initial", // Override minimum width to allow the button to be smaller
              fontSize: "0.7rem", // Smaller font size
              "&:hover": {
                backgroundColor: "grey.100",
              },
              "&:focus": {
                outline: "none",
              },
              "&.MuiButtonBase-root:focus": {
                outline: "none",
              },
            }}
          >
            {expanded.length > 0 ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            onClick={handleSelectClick}
            size="small"
            variant="text"
            sx={{
              color: "grey.900",
              padding: "2px 2px", // Reduced padding
              minWidth: "initial", // Override minimum width to allow the button to be smaller
              fontSize: "0.7rem", // Smaller font size
              "&:hover": {
                backgroundColor: "grey.100",
              },
              "&:focus": {
                outline: "none",
              },
              "&.MuiButtonBase-root:focus": {
                outline: "none",
              },
            }}
          >
            {selected.length > 0 ? "Deselect All" : "Select All"}
          </Button>
        </Box>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleNodeSelect}
          sx={{ height: 700, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          {renderTreeItems(hashTable)}
        </TreeView>
      </Paper>
    </Grid>
  );
};

export default NavBarComponent;
