import React, { ReactElement } from "react";
import { useCpuUsage } from "./useCpuUsage";
import MessageHolder, {
  AddFunction,
} from "../components/MessagesHolder/MessageHolder";

type ReactContent = ReactElement | ReactElement[];

type CPUMeasure = {
  load: number;
  date: number;
};

interface GlobalContext {
  cpuMeasures: CPUMeasure[];
  alarms: CPUMeasure[];
  recovers: CPUMeasure[];
}

const GlobalContext = React.createContext({
  cpuMeasures: [] as CPUMeasure[],
  alarms: [] as CPUMeasure[],
  recovers: [] as CPUMeasure[],
});

GlobalContext.displayName = "GlobalContext";

const useGlobalContext = (): GlobalContext => {
  const context = React.useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface Props {
  children: ReactContent;
}

export const GlobalProvider = ({ children }: Props): ReactElement => {
  const ref = React.useRef<null | AddFunction>(null);

  const launchALarm = React.useCallback(() => {
    ref.current?.(`Your CPU went to a heavy load`, "warning");
  }, [ref]);

  const launchRecover = React.useCallback(() => {
    ref.current?.(`The CPU has recovered from the heavy load`, "info");
  }, [ref]);

  const context: GlobalContext = useCpuUsage({
    launchALarm,
    launchRecover,
  });

  return (
    <GlobalContext.Provider value={context}>
      <MessageHolder
        children={(add: AddFunction) => {
          ref.current = add;
        }}
      />
      {children}
    </GlobalContext.Provider>
  );
};

export default useGlobalContext;
