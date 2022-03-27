import { rest } from "msw";
import { API_URL } from "../utils/constants";

const mockDate = 1648371775233;
export const handlers = [
  rest.get(`${API_URL}/cpu/usage`, (_, res, ctx) => {
    return res(ctx.json({ load: 0.5, date: mockDate }));
  }),
];
