import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface SentimentPieChartProps {
  sentimentResults: string[];
}

interface ChartData {
  name: string;
  value: number;
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({
  sentimentResults,
}) => {
  const data: ChartData[] = [
    {
      name: "Negative",
      value: sentimentResults.filter((x) => x === "Negative").length,
    },
    {
      name: "Neutral",
      value: sentimentResults.filter((x) => x === "Neutral").length,
    },
    {
      name: "Positive",
      value: sentimentResults.filter((x) => x === "Positive").length,
    },
  ];

  const COLORS = ["#FF8042", "#00C49F", "#0088FE"];

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  // Render custom labels with correct percentage calculation
  const renderCustomLabel = ({ name, value }: ChartData) => {
    if (value === 0) return null;
    const percentage = ((value / total) * 100).toFixed(0);
    return `${name} ${percentage}%`;
  };

  return (
    <PieChart width={500} height={275}>
      <Pie
        data={data}
        cx={245}
        cy={125}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={renderCustomLabel}
      >
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default SentimentPieChart;
