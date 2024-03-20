import React, { useState, useEffect } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";
import { fetchHashTable } from "./NavBar/FetchMeetings";
import { SelectedTextProvider } from "./SelectedTextContext";
import createTheme from "@mui/material/styles/createTheme";
import {
  ThemeProvider,
  Switch,
  FormGroup,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";

const App = () => {
  const [hashTable, setHashTable] = useState({});
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState(
    prefersDarkMode ? "dark" : "light"
  );

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const loadHashTable = async () => {
      const table = await fetchHashTable();
      setHashTable(table);
    };
    loadHashTable();
  }, []);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    if (selectedYear !== year) {
      setSelectedMonth(null);
      setSelectedDay(null);
    }
  };

  const handleMonthSelect = (year: string, month: string) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    if (selectedMonth !== month) {
      setSelectedDay(null);
    }
  };

  const handleDaySelect = (filePath: string) => {
    setSelectedFilePath(filePath);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SelectedTextProvider>
        <FormGroup
          row
          sx={{ justifyContent: "flex-start", marginLeft: 3, marginTop: "-1%" }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={themeMode === "dark"}
                onChange={toggleThemeMode}
                icon={
                  <WbSunnyIcon
                    sx={{
                      color: "gold",
                      marginLeft: -0.5,
                      marginTop: -0.5,
                      fontSize: 30,
                    }}
                  />
                }
                checkedIcon={<NightsStayIcon sx={{ marginTop: -0.3 }} />}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    padding: 1,
                    "&.Mui-checked": {
                      transform: "translateX(75%)",
                      "& + .MuiSwitch-track": {
                        opacity: 0.7,
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    borderRadius: 12,
                    backgroundColor:
                      themeMode === "dark"
                        ? theme.palette.grey[700]
                        : theme.palette.grey[400],
                    opacity: 0.7,
                    width: "100%",
                  },
                }}
              />
            }
            labelPlacement="end"
          />
        </FormGroup>

        <NavBarComponent
          hashTable={hashTable}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onSelectYear={handleYearSelect}
          onSelectMonth={handleMonthSelect}
          onSelectDay={handleDaySelect}
        />
        <ChatComponent
          link={selectedFilePath}
          updateFilePath={setSelectedFilePath}
        />
      </SelectedTextProvider>
    </ThemeProvider>
  );
};

export default App;
