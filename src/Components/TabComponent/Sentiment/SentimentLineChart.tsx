import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SentimentLineChartProps {
  sentimentResults: string[];
}

const SentimentLineChart: React.FC<SentimentLineChartProps> = ({
  sentimentResults,
}) => {
  const data = sentimentResults.map((sentiment, index) => ({
    name: `Point ${index + 1}`,
    Sentiment: sentiment === "Positive" ? 2 : sentiment === "Neutral" ? 1 : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 40,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 2]} ticks={[0, 1, 2]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Sentiment"
          stroke="#8884d8"
          strokeWidth={3}
          dot={{ stroke: "#8884d8", strokeWidth: 2, r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SentimentLineChart;
