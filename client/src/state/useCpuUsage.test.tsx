import { QueryClient, QueryClientProvider } from "react-query";
import { server } from "../__mocks__/server";
import "@testing-library/jest-dom";

import { renderHook } from "@testing-library/react-hooks";
import { useCpuUsage } from "./useCpuUsage";

const mockResults = [{ date: 1648371775233, load: 0.5 }];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const queryWrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock("../utils/constants", () => ({
  API_URL: "localhost",
  TIME_FETCHING_INTERVAL: 5,
  TIME_TO_LAUNCH_ALARM: 1,
  HIGH_LOAD: 5,
  SIZE_WINDOW: 2,
}));

const mockLaunchAlarm = jest.fn();
const mockLaunchRecover = jest.fn();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => jest.clearAllMocks());

describe("useCpuUsage", () => {
  const givenComponentRendered = () =>
    renderHook(
      () =>
        useCpuUsage({
          launchALarm: mockLaunchAlarm,
          launchRecover: mockLaunchRecover,
        } as any),
      { wrapper: queryWrapper }
    );

  it("should return the cpu usage", async () => {
    const { result, waitForNextUpdate } = givenComponentRendered();

    await waitForNextUpdate();

    expect(result.current.cpuMeasures).toEqual(mockResults);
  });

  it("should launch a high load alarm", async () => {
    const { result, waitForValueToChange } = givenComponentRendered();

    await waitForValueToChange(() => result.current.alarms);

    expect(mockLaunchAlarm).toHaveBeenCalledTimes(1);
    expect(result.current.alarms).toEqual(mockResults);
  });
});
