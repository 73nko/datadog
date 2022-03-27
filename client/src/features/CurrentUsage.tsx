import { memo } from "react";
import useGlobalContext from "../state/GlobalContext";

import ReactTooltip from "react-tooltip";
import InfoText from "../components/InfoText";
import Box from "../components/Box";

import { getLoadOnPercentage, getTime } from "../utils";

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

// We are memoizing the component to avoid re-rendering it when a new measure is fetched
// in most of the cases, the measure will not change.
const MeasureBox = memo(({ measureLoad }: { measureLoad: number }) => (
  <Box title="CPU Usage">
    <InfoText text={`${measureLoad}%`} />
  </Box>
));

const AlarmsBox = memo(
  ({ alarms, recovers }: { alarms: []; recovers: [] }): JSX.Element => (
    <div className="alarms">
      <div data-tip="" data-for="alarm">
        <Box title="High Load Alarms">
          <InfoText text={`⚠️ ${alarms.length}`} />
        </Box>
      </div>
      {alarms.length > 0 && (
        <ReactTooltip
          id="alarm"
          backgroundColor="hsl(263 90% 51%)"
          getContent={() => alarmsDetails({ alarms })}
        />
      )}
      <div data-tip="" data-for="recover">
        <Box title="High Load Recovers">
          <InfoText text={`✔ ${recovers.length}`} />
        </Box>
      </div>
      {recovers.length > 0 && (
        <ReactTooltip
          id="recover"
          backgroundColor="hsl(263 90% 51%)"
          getContent={() => recoversDetails({ recovers })}
        />
      )}
    </div>
  )
);

const alarmsDetails = ({ alarms }: { alarms: [] }) => {
  return (
    <ul className="details">
      {alarms.map((alarm: { date: number; load: number }) => (
        <li key={alarm.date}>
          <p>
            A Heavy load CPU alarm of:{" "}
            <em>{getLoadOnPercentage(alarm.load)}%</em> at{" "}
            <em>{getTime(new Date(alarm.date))}</em>
          </p>
        </li>
      ))}
    </ul>
  );
};

const recoversDetails = ({ recovers }: { recovers: [] }) => {
  return (
    <ul className="details">
      {recovers.map((recover: { date: number; load: number }) => (
        <li key={recover.date}>
          <p>
            A Heavy load CPU recover of:{" "}
            <em>{getLoadOnPercentage(recover.load)}%</em> at{" "}
            <em>{getTime(new Date(recover.date))}</em>
          </p>
        </li>
      ))}
    </ul>
  );
};
