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
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
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
