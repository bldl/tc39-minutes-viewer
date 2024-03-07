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

interface AppBarComponentProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleClearMessages: () => void;
  handleSelectOption: (selectedOption: string) => void;
}

interface Option {
  label: string;
  id: number;
  category: string;
}

// Styles for group headers
const GroupHeader = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === "light"
      ? "0px 2px 4px rgba(0,0,0,0.1)"
      : "0px 2px 4px rgba(255,255,255,0.1)",
  margin: theme.spacing(0.5, 0), // Adjust as needed
}));

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleClearMessages,
  handleSelectOption,
}) => {
  // Use the theme from MUI's useTheme hook
  const theme = useTheme();
  const themeMode = theme.palette.mode;
  const myDefaultOption = {
    label: "Search with GPT-3.5",
    id: 1,
    category: "ChatGPT",
  };

  const options: Option[] = [
    myDefaultOption,
    { label: "Topics", id: 2, category: "List" },
    { label: "Sentiment", id: 3, category: "Analysis" },
    { label: "Persons", id: 4, category: "List" },
    // Add more options as needed, assigning them to categories
  ];

  const _filterOptions = createFilterOptions<Option>();
  const filterOptions = (options: Option[], state: any) => {
    const results = _filterOptions(options, state);

    if (!results.includes(myDefaultOption)) {
      results.unshift(myDefaultOption);
    }

    return results;
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
          options={options.sort(
            (a, b) => -b.category.localeCompare(a.category)
          )}
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
            if (value && value.label === myDefaultOption.label) {
              handleSendMessage();
            }
            if (value) {
              handleSelectOption(value.label); // Assuming handleSelectOption can handle all options
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
              {option.label}
            </li>
          )}
          renderGroup={(params: AutocompleteRenderGroupParams) => [
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <ul>{params.children}</ul>
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
