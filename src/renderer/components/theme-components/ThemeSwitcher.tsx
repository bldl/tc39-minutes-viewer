import React from "react";
import { Switch, FormControlLabel } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";

interface ThemeSwitcherProps {
  themeMode: "light" | "dark";
  toggleThemeMode: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  themeMode,
  toggleThemeMode,
}) => {
  return (
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
        />
      }
      label={undefined}
    />
  );
};

export default ThemeSwitcher;
