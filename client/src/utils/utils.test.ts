import { getTime, getLoadOnPercentage } from "./index";

const mockDate = 1648371775233;

describe("getTime", () => {
  it("should return a string", () => {
    const date = new Date(mockDate);
    const time = getTime(date);

    expect(typeof time).toBe("string");
  });

  it("should return a string with the correct format", () => {
    const date = new Date(mockDate);
    const time = getTime(date);

    expect(time).toBe("11:2:55");
  });
});

describe("getLoadOnPercentage", () => {
  it("should return a number", () => {
    const load = 0.5;
    const percentage = getLoadOnPercentage(load);

    expect(typeof percentage).toBe("number");
  });

  it("should return a number with the correct format", () => {
    const load = 0.5;
    const percentage = getLoadOnPercentage(load);

    expect(percentage).toBe(500);
  });
});
