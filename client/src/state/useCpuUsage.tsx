import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getUsage } from "../api/cpu";

import { getLoadOnPercentage } from "../utils";
import {
  TIME_FETCHING_INTERVAL,
  TIME_TO_LAUNCH_ALARM,
  HIGH_LOAD,
  SIZE_WINDOW,
} from "../utils/constants";

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
  const [cpuMeasures, setCpuMeasures] = useState<CPUMeasure[]>([]);

  const [isOnAlarm, setIsOnAlarm] = useState<CPUMeasure | null>(null);
  const [alarms, setAlarms] = useState<CPUMeasure[]>([]);
  const [recovers, setRecovers] = useState<CPUMeasure[]>([]);

  const { data: measure } = useQuery<CPUMeasure>("usage", getUsage, {
    refetchIntervalInBackground: true,
    refetchInterval: TIME_FETCHING_INTERVAL,
  });

  useEffect(() => {
    if (measure) {
      if (cpuMeasures.length >= SIZE_WINDOW) {
        cpuMeasures.shift();
      }

      setCpuMeasures((measures) => [...measures, measure]);
    }
  }, [measure]);

  useEffect(() => {
    if (cpuMeasures.length >= TIME_TO_LAUNCH_ALARM) {
      let last2Mins = cpuMeasures.slice(
        cpuMeasures.length - TIME_TO_LAUNCH_ALARM
      );
      let newAlarm = last2Mins.every(
        (m) => getLoadOnPercentage(m.load) >= HIGH_LOAD
      );
      let lastMeasure = cpuMeasures[cpuMeasures.length - 1];
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
