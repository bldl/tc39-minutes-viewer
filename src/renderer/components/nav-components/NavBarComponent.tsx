import React from "react";
import { Grid, Paper } from "@mui/material";
import CustomTreeView from "./utils/CustomTreeView";
import { useSelection } from "../contexts/SelectionContext";

interface NavBarComponentProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({ hashTable }) => {
  // Use selection context
  const { setSelectedFilePath } = useSelection();

  const onSelectDay = (filePath: string) => {
    setSelectedFilePath(filePath);
  };

  return (
    <Grid item xs={12} style={{ position: "relative", marginLeft: "1%" }}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "91.2vh",
          width: "17%",
          position: "absolute",
          top: "10%",
          borderRadius: "20px",
        }}
      >
        <CustomTreeView hashTable={hashTable} onSelectDay={onSelectDay} />
      </Paper>
    </Grid>
  );
};

export default NavBarComponent;
