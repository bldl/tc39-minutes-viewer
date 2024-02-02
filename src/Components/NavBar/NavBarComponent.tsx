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

interface NavBarComponentProps {
  folderOptions: { label: string; value: string }[];
  fileOptions: Record<string, { label: string; value: string }[]>; // Record of folder path to array of files
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

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const handleFolderClick = (folder: string) => {
    setOpenFolders((prevOpenFolders) => ({
      ...prevOpenFolders,
      [folder]: !prevOpenFolders[folder],
    }));
    onSelectFolder(folder);
  };

  const handleFileClick = (filePath: string) => {
    onSelectFile(filePath);
  };


  return (
    <Grid item xs={1} style={{ position: "relative" }}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "89vh",
            width: "15%",
            position: "absolute",
            top: "10%",
            borderRadius: "20px"
          }}
        >
          <List>
            {folderOptions.map((folder) => (
              <React.Fragment key={folder.value}>
                <ListItem
                  button
                  onClick={() => handleFolderClick(folder.value)}
                >
                  <ListItemText primary={folder.label} />
                  {openFolders[folder.value] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={openFolders[folder.value]}
                  timeout="auto"
                  unmountOnExit
                >
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
    </Grid>
  );
};

export default NavBarComponent;
