import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import CurrentUsage from "./CurrentUsage";

jest.mock("../state/GlobalContext", () => ({
  default: jest.fn().mockReturnValue({
    cpuMeasures: [{ date: 1648371775233, load: 0.5 }],
    alarms: [{ date: 1648371775233, load: 0.5 }],
    recovers: [{ date: 1648371775233, load: 0.5 }],
  }),
}));

describe("useCpuUsage", () => {
  const currentUsage = () => render(<CurrentUsage />);

  it("should render the current CPU usage", async () => {
    currentUsage();

    await waitFor(() => screen.getByText("CPU Usage"));

    expect(screen.getByText("CPU Usage")).toBeInTheDocument();
    expect(screen.getByText("500%")).toBeInTheDocument();
  });

  it("should render the High Load Alarms", async () => {
    currentUsage();

    await waitFor(() => screen.getByText("High Load Alarms"));

    expect(screen.getByText("High Load Alarms")).toBeInTheDocument();
    expect(screen.getByText("⚠️ 1")).toBeInTheDocument();
  });

  it("should render the recovers alarms", async () => {
    currentUsage();

    await waitFor(() => screen.getByText("High Load Recovers"));

    expect(screen.getByText("High Load Recovers")).toBeInTheDocument();
    expect(screen.getByText("✔ 1")).toBeInTheDocument();
  });
});
