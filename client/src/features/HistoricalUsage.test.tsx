import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import HistoricalUsage from "./HistoricalUsage";

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ height, children }: any) => (
      <OriginalModule.ResponsiveContainer width={800} height={height}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

jest.mock("../state/GlobalContext", () => ({
  default: jest.fn().mockReturnValue({
    cpuMeasures: [
      { date: 1648371775233, load: 0.5 },
      { date: 1648371845233, load: 0.4 },
      { date: 1648371975233, load: 0.8 },
    ],
  }),
}));

describe("useCpuUsage", () => {
  const historicalUsage = () => render(<HistoricalUsage />);

  it("should render a chart with the cpu measures", async () => {
    historicalUsage();

    // The times of every measure
    expect(await screen.findByText("11:2:55")).toBeInTheDocument();
    expect(await screen.findByText("11:4:5")).toBeInTheDocument();
    expect(await screen.findByText("11:6:15")).toBeInTheDocument();

    // The heviest load
    expect(await screen.findByText("800")).toBeInTheDocument();
  });
});
