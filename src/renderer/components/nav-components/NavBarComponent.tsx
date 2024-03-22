import React from "react";
import { Grid, Paper } from "@mui/material";
import CustomTreeView from "./utils/CustomTreeView";

interface NavBarComponentProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
  onSelectDay: (filePath: string) => void;
  selectedYear?: string | null;
  selectedMonth?: string | null;
  onSelectYear?: (year: string) => void;
  onSelectMonth?: (year: string, month: string) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  hashTable,
  onSelectDay,
}) => {
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
