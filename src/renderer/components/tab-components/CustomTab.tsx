import React from 'react';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface CustomTabProps {
  label: string;
  tabValue: string;
  onClose: () => void;
}

export const CustomTab: React.FC<CustomTabProps> = ({ label, tabValue, onClose }) => (
  <Tab
    label={
      <span>
        {label}
        <IconButton size="small" component="span" onClick={onClose} style={{ marginLeft: "auto" }}>
          <CloseIcon />
        </IconButton>
      </span>
    }
    value={tabValue}
  />
);

