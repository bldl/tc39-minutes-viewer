import React from "react";
import { AppBar, Toolbar, Button, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

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
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleClearMessages,
  handleSelectOption,
}) => {
  const myDefaultOption = { label: "Search with GPT-3.5", id: 1 };

  const options: Option[] = [
    myDefaultOption,
    { label:"Topics", id: 2 },
    { label:"Sentiment", id: 3 },
    { label:"Persons", id: 4 },
    // Add more options as needed
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
        background: "white",
        borderRadius: "20px",
        padding: "10px",
        marginLeft: "0%",
        width: "100%",
      }}
    >
      <Toolbar>
        <Autocomplete
          disablePortal
          filterOptions={filterOptions}
          options={options}
          sx={{ width: 950 }}
          onChange={(_event, value) => {
            if (value && value.label === myDefaultOption.label) {
              handleSendMessage();
            }
            if (value) {
              handleSelectOption(value.label); // Call handleSelectOption with the selected option label
            }
          }}
          inputValue={input}  
          isOptionEqualToValue={(option, value) => option.label === value.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="What do you want to know?"
              value={input}
              onChange={handleInputChange}
            />
          )}
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
