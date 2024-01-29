import React from 'react';
import { Autocomplete, Grid, Paper, TextField } from '@mui/material';

interface NavBarComponentProps {
    options: string[];
    label: string;
    onSelect: (value: string | null) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({ options, label, onSelect }) => {

    const handleChange = (event: React.SyntheticEvent, value: string | null) => {
        onSelect(value);
    };

    return (
        <>
        <Grid item xs={1}>
            <Paper
            elevation={3}
            style={{ padding: "20px", overflowY: "auto", height: "81.5vh", width: "10%", position:"absolute"}}
            >
                <Autocomplete
                    options={options}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            variant="outlined"
                        />
                    )}
                    PaperComponent={(props) => (
                        <Paper {...props} style={{ maxHeight: 480, overflow:"auto"}} />
                      )}
                    />
            </Paper>
        </Grid>
        </>
    );
}

export default NavBarComponent;
