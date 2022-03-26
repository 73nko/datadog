import React from "react";
import { useQuery } from "react-query";
import { getUsage } from "../api/cpu";

import { getLoadOnPercentage } from "../utils";

const TIME_FETCHING_INTERVAL = 10000; // 10 seconds
const SIZE_MEASURES = 60; // 10 mins in 10 secs intervals
const TIME_TO_LAUNCH_ALARM = 12; // last 2 minutes
const HIGH_LOAD = 100;

type CPUMeasure = {
  load: number;
  date: number;
};

interface GlobalContext {
  cpuMeasures: CPUMeasure[];
  alarms: CPUMeasure[];
  recovers: CPUMeasure[];
}

export const useCpuUsage = ({
  launchALarm,
  launchRecover,
}: {
  launchALarm: () => void;
  launchRecover: () => void;
}): GlobalContext => {
  const [cpuMeasures, setCpuMeasures] = React.useState<CPUMeasure[]>([]);

  const [isOnAlarm, setIsOnAlarm] = React.useState<CPUMeasure | null>(null);
  const [alarms, setAlarms] = React.useState<CPUMeasure[]>([]);
  const [recovers, setRecovers] = React.useState<CPUMeasure[]>([]);

  const { data: measure } = useQuery<CPUMeasure>("usage", getUsage, {
    refetchIntervalInBackground: true,
    refetchInterval: TIME_FETCHING_INTERVAL,
  });

  React.useEffect(() => {
    if (measure) {
      if (cpuMeasures.length >= SIZE_MEASURES) {
        cpuMeasures.shift();
      }

      setCpuMeasures((measures) => [...measures, measure]);
    }
  }, [measure]);

  React.useEffect(() => {
    if (cpuMeasures.length >= TIME_TO_LAUNCH_ALARM) {
      let last2Mins = cpuMeasures.slice(
        cpuMeasures.length - TIME_TO_LAUNCH_ALARM
      );
      let newAlarm = last2Mins.every(
        (m) => getLoadOnPercentage(m.load) >= HIGH_LOAD
      );
      let lastMeasure = cpuMeasures.at(-1);

      if (lastMeasure !== undefined) {
        if (newAlarm && !isOnAlarm) {
          setIsOnAlarm(lastMeasure);
          setAlarms((alarms) => [...alarms, lastMeasure as CPUMeasure]);
          launchALarm();
        } else if (isOnAlarm && !newAlarm) {
          setIsOnAlarm(null);
          setRecovers((recovers) => [...recovers, lastMeasure as CPUMeasure]);
          launchRecover();
        }
      }
    }
  }, [cpuMeasures]);

  return {
    cpuMeasures,
    alarms,
    recovers,
  };
};
