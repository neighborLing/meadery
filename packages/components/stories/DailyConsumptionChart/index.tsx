import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../Card';
import React from 'react';
import { getDays } from '../utils/time';

const days = getDays();
const data = new Array(days).fill(0).map((day, index) => {
  return { day: index + 1, expend: Math.random() * 1000 }
});

const CustomizedLabel = ({ x, y, value }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={10} y={-10} dy={0} textAnchor="end" fill="#666">
        { parseInt(value) }
      </text>
    </g>
  );
}

export const DailyConsumptionChart = () => (
  <Card title="DailyConsumptionChart">
    <div className="mt-4">
      <LineChart width={1500} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="expend" stroke="#8884d8" label={CustomizedLabel} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  </Card>
);
