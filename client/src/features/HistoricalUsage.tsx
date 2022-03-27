import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useGlobalContext from "../state/GlobalContext";
import { getLoadOnPercentage, getTime } from "../utils";

import "./historical-usage.css";

const HistoricalUsage = (): JSX.Element => {
  const { cpuMeasures } = useGlobalContext();
  const data = cpuMeasures.map((m) => ({
    load: getLoadOnPercentage(m?.load),
    time: getTime(new Date(m?.date)),
  }));

  return (
    <section className="historical-usage">
      <ResponsiveContainer width="95%" height={400}>
        <AreaChart data={data} id="cpu-usage">
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis dataKey="time" />
          <YAxis dataKey="load" />
          <Tooltip />
          <Area type="basis" dataKey="load" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default HistoricalUsage;
