import React from "react";
import { AppBar, Toolbar, Button, TextField } from "@mui/material";
import Autocomplete, {
  createFilterOptions,
  AutocompleteRenderGroupParams,
} from "@mui/material/Autocomplete";
import { styled, useTheme } from "@mui/material/styles";
import ListSubheader from "@mui/material/ListSubheader";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChatIcon from "@mui/icons-material/Chat";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CodeIcon from "@mui/icons-material/Code"; // Icon for the execute command

interface AppBarComponentProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleClearMessages: () => void;
  handleSelectOption: (selectedOption: string) => void;
  updateFilePath: (filePath: string) => void; // Accept this prop
}

interface Option {
  label: string;
  id: number;
  category: string;
  isCommand?: boolean; // Optional property to identify command options
}

// Styles for group headers
const GroupHeader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleClearMessages,
  handleSelectOption,
  updateFilePath,
}) => {
  const theme = useTheme();
  const themeMode = theme.palette.mode;

  const commandOption: Option = {
    label: "Execute command",
    id: -1, // Unique ID for the command option
    category: "Commands",
    isCommand: true,
  };

  const options: Option[] = [
    { label: "Search with GPT-3.5", id: 1, category: "ChatGPT" },
    { label: "Topics", id: 2, category: "List" },
    { label: "Sentiment", id: 3, category: "Analysis" },
    { label: "Persons", id: 4, category: "List" },
    // Additional static options...
  ];

  // Custom filterOptions function to always include the "Execute command" option
  const filterOptions = (options: Option[], params: { inputValue: string }) => {
    const filtered = createFilterOptions<Option>()(options, {
      ...params,
      getOptionLabel: (option) => option.label,
    });

    // Check if "Execute command" is already included due to the current input value
    if (!filtered.some((option) => option.isCommand)) {
      filtered.push(commandOption); // Always add the "Execute command" option
    }

    return filtered;
  };

  return (
    <AppBar
      position="static"
      style={{
        ...(themeMode === "light" && {
          background: theme.palette.background.default,
        }),
        borderRadius: "20px",
        padding: "10px",
        marginLeft: "0%",
        width: "80.7vw",
      }}
    >
      <Toolbar>
        <Autocomplete
          disablePortal
          filterOptions={filterOptions}
          options={options}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="What do you want to know?"
              value={input}
              onChange={handleInputChange}
            />
          )}
          onChange={(_event, value) => {
            if (value?.isCommand) {
              // Example input: "2018-03/mar-20.md/topics/sentiment"
              const basePath = "../public/meetings/";
              let topics: string[] = [];
              let sentiments: string[] = [];

              // Use a regular expression to extract the parts of the input
              const parts = input.match(/^(.+?\.md)(?:\/(topics|sentiment))?$/);

              if (parts) {
                const filePath = basePath + parts[1]; // "../public/meetings/2018-03/mar-20.md"
                updateFilePath(filePath);

                // If there's a second part and it's 'topics', add to topics array
                if (parts[2] === "topics") {
                  topics.push(parts[2]);
                }

                // If there's a second part and it's 'sentiment', add to sentiments array
                if (parts[2] === "sentiment") {
                  sentiments.push(parts[2]);
                }

                // Assuming openTabs is a function you'll implement
                //openTabs(topics, sentiments);
                console.log(filePath);
              }
            } else if (value) {
              if (value.label === "Search with GPT-3.5") {
                handleSendMessage();
              } else {
                handleSelectOption(value.label);
              }
            }
          }}
          renderOption={(props, option) => (
            <li {...props}>
              {option.category === "Analysis" && (
                <AnalyticsIcon style={{ marginRight: 8 }} />
              )}
              {option.category === "ChatGPT" && (
                <ChatIcon style={{ marginRight: 8 }} />
              )}
              {option.category === "List" && (
                <FormatListNumberedIcon style={{ marginRight: 8 }} />
              )}
              {option.category === "Commands" && (
                <CodeIcon style={{ marginRight: 8 }} />
              )}
              {option.label}
            </li>
          )}
          renderGroup={(params: AutocompleteRenderGroupParams) => [
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              {params.children}
            </li>,
          ]}
          sx={{ width: 950, zIndex: 100 }}
          inputValue={input}
        />
        <Button
          style={{ marginLeft: "50px" }}
          variant="contained"
          color="primary"
          onClick={handleClearMessages}
        >
          Clear
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
