import React, { useState } from "react";
import {
  Autocomplete,
  Grid,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface NavBarComponentProps {
  folderOptions: { label: string, value: string }[];
  fileOptions: Record<string, { label: string, value: string }[]>; // Record of folder path to array of files
  label: string;
  onSelectFolder: (value: string | null) => void;
  onSelectFile: (value: string | null) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  folderOptions,
  fileOptions,
  label,
  onSelectFolder,
  onSelectFile,
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

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const handleFolderClick = (folder: string) => {
    setOpenFolders(prevOpenFolders => ({ ...prevOpenFolders, [folder]: !prevOpenFolders[folder] }));
    onSelectFolder(folder);
  };

  const handleFileClick = (filePath: string) => {
    onSelectFile(filePath);
  };

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
                        <List>
              {folderOptions.map((folder) => (
                <React.Fragment key={folder.value}>
                  <ListItem button onClick={() => handleFolderClick(folder.value)}>
                    <ListItemText primary={folder.label} />
                    {openFolders[folder.value] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openFolders[folder.value]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {fileOptions[folder.value]?.map((file) => (
                        <ListItem 
                          key={file.value}
                          button 
                          onClick={() => handleFileClick(file.value)}
                          style={{ paddingLeft: "32px" }}
                        >
                          <ListItemText primary={file.label} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Grid>
    </>
  );
};

export default NavBarComponent;
