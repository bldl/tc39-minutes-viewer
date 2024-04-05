import { useState, useEffect } from "react";
import ChatComponent from "./search-bar-components/chat-components/ChatComponent";
import NavBarComponent from "./nav-components/NavBarComponent";
import { fetchHashTable } from "./nav-components/utils/FetchMeetings";
import { SelectedTextProvider } from "./contexts/SelectedTextContext";
import { ThemeProvider, FormGroup } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeSwitcher from "./theme-components/ThemeSwitcher";
import useThemeMode from "./theme-components/useThemeMode";
import { SelectionProvider } from "./contexts/SelectionContext";

const App = () => {
  const [hashTable, setHashTable] = useState({});
  const { theme, themeMode, toggleThemeMode } = useThemeMode();

  // Load the hashtable (Navigation table) on launch
  useEffect(() => {
    const loadHashTable = async () => {
      const table = await fetchHashTable();
      setHashTable(table);
    };
    loadHashTable();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SelectedTextProvider>
        <SelectionProvider>
          {" "}
          {/* This provides selection state context */}
          <FormGroup
            row
            sx={{
              justifyContent: "flex-start",
              marginLeft: 3,
              marginTop: "-1%",
            }}
          >
            <ThemeSwitcher
              themeMode={themeMode}
              toggleThemeMode={toggleThemeMode}
            />
          </FormGroup>
          <NavBarComponent hashTable={hashTable} />
          <ChatComponent isLoading={false} />
        </SelectionProvider>
      </SelectedTextProvider>
    </ThemeProvider>
  );
};

export default App;
