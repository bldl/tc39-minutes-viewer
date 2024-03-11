import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SentimentBarChartProps {
  sentimentResults: string[];
}

const SentimentBarChart: React.FC<SentimentBarChartProps> = ({
  sentimentResults,
}) => {
  const data = [
    {
      name: "Negative",
      count: sentimentResults.filter((x) => x === "Negative").length,
    },
    {
      name: "Neutral",
      count: sentimentResults.filter((x) => x === "Neutral").length,
    },
    {
      name: "Positive",
      count: sentimentResults.filter((x) => x === "Positive").length,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} /> <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SentimentBarChart;
