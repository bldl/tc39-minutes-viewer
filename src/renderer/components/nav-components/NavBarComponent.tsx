import React from "react";
import { Grid, Paper } from "@mui/material";
import CustomTreeView from "./utils/CustomTreeView";
import { useSelection } from "../contexts/SelectionContext";

// Remove onSelectDay, selectedYear, selectedMonth, onSelectYear, onSelectMonth from the props
// as we'll be using the context for that
interface NavBarComponentProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({ hashTable }) => {
  // Use selection context
  const {
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    setSelectedFilePath,
  } = useSelection();

  // Adjusted onSelectDay function to use setSelectedFilePath from the context
  const onSelectDay = (filePath: string) => {
    setSelectedFilePath(filePath);
  };

  // Functions to handle year and month selection can be added here if needed
  // Example onSelectYear:
  const onSelectYear = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth(null); // Reset the month when a new year is selected
    setSelectedFilePath(null); // Reset the day/filePath as well
  };

  // Example onSelectMonth:
  const onSelectMonth = (month: string) => {
    if (selectedYear) {
      setSelectedMonth(month);
      setSelectedFilePath(null); // Reset the day/filePath as well
    }
  };

  // Use the onSelectDay, onSelectYear, onSelectMonth functions in CustomTreeView

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
        <CustomTreeView
          hashTable={hashTable}
          onSelectDay={onSelectDay}
        />
      </Paper>
    </Grid>
  );
};

export default NavBarComponent;
