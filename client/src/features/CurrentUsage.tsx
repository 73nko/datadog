import { memo } from "react";
import useGlobalContext from "../state/GlobalContext";

import InfoText from "../components/InfoText";
import Box from "../components/Box";

import { getLoadOnPercentage } from "../utils";

import "./current-usage.css";

const CurrentUsage = (): JSX.Element => {
  const { cpuMeasures, alarms, recovers } = useGlobalContext();
  const lastMeasure = cpuMeasures[cpuMeasures.length - 1];

  const measureLoad = lastMeasure ? getLoadOnPercentage(lastMeasure.load) : 0;
  return (
    <section className="current-usage">
      <MeasureBox measureLoad={measureLoad} />
      <AlarmsBox alarms={alarms as []} recovers={recovers as []} />
    </section>
  );
};

export default CurrentUsage;

const MeasureBox = memo(({ measureLoad }: { measureLoad: number }) => (
  <Box title="CPU Usage">
    <InfoText text={`${measureLoad}%`} />
  </Box>
));

const AlarmsBox = memo(
  ({ alarms, recovers }: { alarms: []; recovers: [] }): JSX.Element => (
    <div className="alarms">
      <Box title="High Load Alarms">
        <InfoText text={`⚠️ ${alarms.length}`} />
      </Box>

      <Box title="High Load Recovers">
        <InfoText text={`✔ ${recovers.length}`} />
      </Box>
    </div>
  )
);
