import { QueryClient, QueryClientProvider } from "react-query";
import { server } from "./__mocks__/server";
import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

jest.mock("./utils/constants", () => ({
  APP_TITLE: "test",
  API_URL: "localhost",
  TIME_FETCHING_INTERVAL: 5,
  TIME_TO_LAUNCH_ALARM: 1,
  HIGH_LOAD: 5,
  SIZE_WINDOW: 2,
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => jest.clearAllMocks());

describe("useCpuUsage", () => {
  const AppComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

  it("should render the App component", async () => {
    AppComponent();

    expect(await screen.findByText("test")).toBeInTheDocument();
  });

  it("should render the CPU usage", async () => {
    AppComponent();

    expect(await screen.findByText("CPU Usage")).toBeInTheDocument();
    expect(await screen.findByText("500%")).toBeInTheDocument();
  });

  it("should render the High Load Alarms", async () => {
    AppComponent();

    expect(await screen.findByText("High Load Alarms")).toBeInTheDocument();
    expect(await screen.findByText("⚠️ 1")).toBeInTheDocument();
  });

  it("should render the High Load Alarm toast", async () => {
    AppComponent();

    waitFor(() =>
      expect(
        screen.findByText("Your CPU went to a heavy load")
      ).toBeInTheDocument()
    );
    expect(
      screen.queryByText("Your CPU went to a heavy load")
    ).not.toBeInTheDocument();
  });
});
