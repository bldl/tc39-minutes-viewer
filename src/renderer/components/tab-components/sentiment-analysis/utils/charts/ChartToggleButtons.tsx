import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

interface ChartToggleButtonsProps {
  chartType: string;
  setChartType: React.Dispatch<React.SetStateAction<string>>;
}

const ChartToggleButtons: React.FC<ChartToggleButtonsProps> = ({
  chartType,
  setChartType,
}) => {
  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newChartType: string
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <StyledToggleButtonGroup
      value={chartType}
      exclusive
      onChange={handleChartTypeChange}
    >
      <ToggleButton value="bar">Bar Chart</ToggleButton>
      <ToggleButton value="pie">Pie Chart</ToggleButton>
      <ToggleButton value="line">Line Chart</ToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default ChartToggleButtons;
