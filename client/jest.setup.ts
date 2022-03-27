import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import { Globals } from "@react-spring/web";

Globals.assign({
  skipAnimation: true,
});
