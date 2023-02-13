import { PieChart, Pie, Sector, Tooltip, Cell, Legend } from "recharts";
import Card from "./card";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#531dab",
  "#861661",
];

function onPieEnter() {
  console.log("enter");
}

const PieDisplay = ({
  data,
  title,
  className,
}: {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
  className: string;
}) => {
  return (
    <Card title={title} className={`mx-5 my-5 ${className}`}>
      <PieChart width={400} height={300} onMouseEnter={onPieEnter}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Card>
  );
};

export default PieDisplay;
