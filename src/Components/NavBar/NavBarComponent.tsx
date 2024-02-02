import React from "react";
import {
  Autocomplete,
  Grid,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

interface NavBarComponentProps {
  options: string[];
  label: string;
  onSelect: (value: string | null) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  options,
  label,
  onSelect,
}) => {
  const handleChange = (_event: React.SyntheticEvent, value: string | null) => {
    onSelect(value);
  };

  return (
    <>
      <Grid item xs={1}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            overflowY: "auto",
            top: "3.5%",
            height: "88.5%",
            width: "13%",
            position: "absolute",
            zIndex: 1000,
          }}
        >
          <Autocomplete
            options={options}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField {...params} label={label} variant="outlined" />
            )}
            PaperComponent={(props) => (
              <Paper {...props} style={{ maxHeight: 480, overflow: "auto" }} />
            )}
          />
        </Paper>
      </Grid>
    </>
  );
};

export default NavBarComponent;
