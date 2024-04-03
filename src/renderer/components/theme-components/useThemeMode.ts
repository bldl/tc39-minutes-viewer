import { useState, useEffect } from "react";
import { PaletteMode, useMediaQuery } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";

const useThemeMode = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState<PaletteMode>(
    prefersDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    setThemeMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return { theme, themeMode, toggleThemeMode };
};

export default useThemeMode;
