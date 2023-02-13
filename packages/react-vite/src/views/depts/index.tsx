import Card from "./components/card";
import Pie from "./components/pie";
import Bar from "./components/bar";
import data from './data';
import {
  getRest,
  getMonthPay,
  getTypePay,
  getPieData,
  getEveryMonthPay,
  formatPrice,
} from "./utils";
import { Data } from "./utils/index.d";

type Props = {
  data: Data;
};

const Dept = () => {
  const rest = getRest(data);
  const monthPay = getMonthPay(data);
  const everyMonthPay = getEveryMonthPay(data);
  const typePay = getTypePay(data);
  const pieData = getPieData(typePay);
  return (
    <div className="dept">
      <div className="dept_count_wrap flex">
        <Card title="今年总计待还金额" className="mx-5 my-5 flex-1">
          <div className="text-white font-bold text-3xl my-2">{rest}</div>
        </Card>
        {typePay.map((type) => {
          return (
              type.monthPay ? <Card
              title={`${type.name}(月/总)`}
              className="mx-5 my-5 flex-1"
              key={type.name}
            >
              <div className="text-white font-bold text-3xl my-2">
                {formatPrice(parseInt(`${type.monthPay}`))}
              </div>
            </Card> : null
          );
        })}
      </div>
      <div className="flex">
        <Bar className="flex-1" data={everyMonthPay} title="每月待还"></Bar>
        <Pie className="flex-1" data={pieData} title="本月待还"></Pie>
      </div>
      <Card title="本月总待还金额" className="mx-5 my-5 flex-1">
        <div className="flex flex-col justify-center h-64">
          <div className="text-white font-bold text-9xl text-center text-red-500">
            {monthPay}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dept;
