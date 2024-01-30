import React, { useState } from "react";
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
  const [isNavBarVisible, setIsNavBarVisible] = useState(false);
  const [buttonStyles, setButtonStyles] = useState({
    marginLeft: "4%",
    height: "8vh",
    width: "10vh",
    borderRadius: "10px",
    top: "7.5%",
  });
  const [buttonText, setButtonText] = useState("NavBar"); // Added state for button text

  const handleButtonClick = () => {
    setIsNavBarVisible((prev) => !prev);

    setButtonStyles((prevStyles) =>
      prevStyles.marginLeft === "4%"
        ? {
            ...prevStyles,
            marginLeft: "12.5%",
            height: "20vh",
            width: "5vh",
            borderRadius: "5px",
            top: "6.7%",
          }
        : {
            ...prevStyles,
            marginLeft: "4%",
            height: "8vh",
            width: "10vh",
            borderRadius: "10px",
            top: "7.5%",
          }
    );

    setButtonText(() => (isNavBarVisible ? "NavBar" : "CLOSE"));
  };

  const handleChange = (_event: React.SyntheticEvent, value: string | null) => {
    onSelect(value);
  };

  return (
    <>
      <Grid item xs={1}>
        <IconButton
          onClick={handleButtonClick}
          style={{
            backgroundColor: "#1876d2",
            color: "white",
            borderRadius: buttonStyles.borderRadius,
            padding: "10px",
            position: "fixed",
            marginLeft: buttonStyles.marginLeft,
            top: buttonStyles.top,
            height: buttonStyles.height,
            width: buttonStyles.width,
            whiteSpace: "nowrap",
            flexDirection: "column",
            border: isNavBarVisible ? "3px solid black" : "none",
            zIndex: 1000,
            transition: 'transform 0.2s', 
            transform: isNavBarVisible ? 'scale(0.9)' : 'scale(1)',
          }}
        >
          {isNavBarVisible ? (
            buttonText.split("").map((letter, index) => (
              <span key={index} style={{ lineHeight: 1.2, fontSize: "1.3rem" }}>
                {letter}
              </span>
            ))
          ) : (
            <DensityMediumIcon />
          )}
        </IconButton>
        {isNavBarVisible && (
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              overflowY: "auto",
              height: "81.5vh",
              width: "10%",
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
                <Paper
                  {...props}
                  style={{ maxHeight: 480, overflow: "auto" }}
                />
              )}
            />
          </Paper>
        )}
      </Grid>
    </>
  );
};

export default NavBarComponent;
