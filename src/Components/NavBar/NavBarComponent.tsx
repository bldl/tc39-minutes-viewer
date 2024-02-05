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

// Update the interface to match the new structure
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
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({});
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  const handleYearClick = (year: string) => {
    setOpenYears((prevOpenYears) => ({
      ...prevOpenYears,
      [year]: !prevOpenYears[year],
    }));
    onSelectYear(year);
  };

  const handleMonthClick = (year: string, month: string) => {
    setOpenMonths((prevOpenMonths) => ({
      ...prevOpenMonths,
      [month]: !prevOpenMonths[month],
    }));
    onSelectMonth(year, month);
  };

  return (
    <Grid item xs={12} style={{ position: "relative" }}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "89vh",
          width: "15%",
          position: "absolute",
          top: "10%",
          borderRadius: "20px",
        }}
      >
        <List>
          {Object.keys(hashTable).map((year) => (
            <React.Fragment key={year}>
              <ListItem button onClick={() => handleYearClick(year)}>
                <ListItemText primary={year} />
                {openYears[year] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openYears[year]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Object.keys(hashTable[year]).map((month) => (
                    <React.Fragment key={month}>
                      <ListItem
                        button
                        onClick={() => handleMonthClick(year, month)}
                        style={{ paddingLeft: 32 }}
                      >
                        <ListItemText primary={month} />
                        {openMonths[month] ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse
                        in={openMonths[month]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {Object.keys(hashTable[year][month]).map((day) => (
                            <ListItem
                              button
                              onClick={() =>
                                onSelectDay(hashTable[year][month][day])
                              }
                              style={{ paddingLeft: 64 }}
                              key={day}
                            >
                              <ListItemText primary={day} />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default NavBarComponent;
