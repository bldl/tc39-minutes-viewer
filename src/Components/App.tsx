import { useState, useEffect } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";
import { fetchHashTable } from "./NavBar/FetchMeetings";
import { SelectedTextProvider } from "./SelectedTextContext";
import {
  createTheme,
  ThemeProvider,
  Switch,
  FormGroup,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";

function App() {
  const [hashTable, setHashTable] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
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

  // Handle for year select
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    if (selectedYear !== year) {
      // Only reset these if a different year is selected
      setSelectedMonth(null);
      setSelectedDay(null);
      // Do not reset setSelectedFilePath here to keep the file open
    }
  };

  // Handle for month select
  const handleMonthSelect = (year, month) => {
    setSelectedYear(year);
    if (selectedMonth !== month) {
      // Only reset these if a different month is selected
      setSelectedDay(null);
      // Do not reset setSelectedFilePath here to keep the file open
    }
  };

  // Handle for day select
  const handleDaySelect = (filePath) => {
    setSelectedFilePath(filePath);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This helps with consistent baseline styles */}
      <SelectedTextProvider>
        <FormGroup row sx={{ justifyContent: "flex-start", marginLeft: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={themeMode === "light"}
                onChange={toggleThemeMode}
                icon={<WbSunnyIcon sx={{ color: "gold" }} />}
                checkedIcon={<NightsStayIcon />}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    // Adjust padding to fit the icons inside the thumb
                    padding: 0, // Reduce padding to increase range
                    "&.Mui-checked": {
                      transform: "translateX(75%)", // Increase translateX to match the increased range
                      "& + .MuiSwitch-track": {
                        opacity: 0.7, // Adjust for visibility if needed
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    borderRadius: 12, // Half the height to create a "pill" shape
                    backgroundColor:
                      themeMode === "dark"
                        ? theme.palette.grey[700]
                        : theme.palette.grey[400], // Adjust as needed
                    width: "auto", // Ensure the track is as wide as needed for the thumb to slide
                  },
                }}
              />
            }
            label={
              <Typography variant="body1" component="div" sx={{ mt: "-0.6em" }}>
                {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
              </Typography>
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
        <ChatComponent link={selectedFilePath} />
      </SelectedTextProvider>
    </ThemeProvider>
  );
}

export default App;
