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
  // cpuMeasures is gonna act as a queue of CPU measures
  // saving the last 10 minutes measurements
  const [cpuMeasures, setCpuMeasures] = useState<CPUMeasure[]>([]);

  // Saving the time when we are launching alarms and recovers
  // At this moment we are just showing the number but
  // we will be able to show details about any alarm launched
  const [alarms, setAlarms] = useState<CPUMeasure[]>([]);
  const [recovers, setRecovers] = useState<CPUMeasure[]>([]);

  // Flag to know if we are still on alarm and do not send too many notifications
  const [isOnAlarm, setIsOnAlarm] = useState<CPUMeasure | null>(null);

  // It will fetch a new CPU usage every 10 seconds
  const { data: measure } = useQuery<CPUMeasure>("usage", getUsage, {
    refetchIntervalInBackground: true,
    refetchInterval: TIME_FETCHING_INTERVAL,
  });

  useEffect(() => {
    // Every time the CPU usage is fetched, we add it to the list
    // we keep a max size of the queue to have a 10 minutes window
    if (measure) {
      if (cpuMeasures.length >= SIZE_WINDOW) {
        cpuMeasures.shift();
      }

      setCpuMeasures((measures) => [...measures, measure]);
    }
  }, [measure]);

  useEffect(() => {
    // If thewre's not enough measures to consider an alarm, we don't do anything
    if (cpuMeasures.length >= TIME_TO_LAUNCH_ALARM) {
      // get the last 2 minutes of measures
      let last2Mins = cpuMeasures.slice(
        cpuMeasures.length - TIME_TO_LAUNCH_ALARM
      );
      // Check if the CPU usage is over the threshold in the last 2 minutes
      let newAlarm = last2Mins.every(
        (m) => getLoadOnPercentage(m.load) >= HIGH_LOAD
      );

      let lastMeasure = cpuMeasures[cpuMeasures.length - 1];
      // This check is just to have TS happy :)
      if (lastMeasure !== undefined) {
        // If we can consider exists an alarm and we didn't already launched it, we launch it
        // in case the CPU would have recovered from the alarm we launch the recover
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
