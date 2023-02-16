import {BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from "recharts";

import Card from "./card";

const barDisplay = ({
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
        <BarChart width={1200} height={300} data={data} className="m-auto">
          <XAxis dataKey="name" />
          <YAxis />
          {/*// 设置padding 10px*/}
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={data[index].value > 8000 ? "#EF4444" : "#531dab"}
              />
            ))}
          </Bar>
        </BarChart>
    </Card>
  );
};

export default barDisplay;
