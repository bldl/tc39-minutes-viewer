import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

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
        />
    );
}

export default NavBarComponent;
