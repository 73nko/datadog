import { useEffect, useMemo, useState } from "react";
import { useTransition } from "@react-spring/web";
import { animated } from "@react-spring/web";
import "./message-holder.css";

export type toastType = "success" | "danger" | "warning" | "info";

export type toast = { message: string; type: toastType; id: number };
export type AddFunction = (message: string, type: toastType) => void;

interface Props {
  config?: {
    tension: number;
    friction: number;
    precision: number;
  };
  timeout?: number;
  children: (add: AddFunction) => void;
}

let id = 0;

function MessageHolder({
  config = { tension: 125, friction: 20, precision: 0.1 },
  timeout = 3000,
  children,
}: Props) {
  const refMap = useMemo(() => new WeakMap(), []);
  const cancelMap = useMemo(() => new WeakMap(), []);
  const [items, setItems] = useState<toast[]>([]);

  const transitions = useTransition(items, {
    from: { opacity: 0, height: 0, life: "100%" },
    keys: (item) => item.id,
    enter: (item) => async (next, cancel) => {
      cancelMap.set(item, cancel);
      await next({ opacity: 1, height: "auto", life: "100%" });
      await next({ life: "0%" });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      setItems((state) =>
        state.filter((i) => {
          return i.id !== item.id;
        })
      );
    },
    config: (item, index, phase) => (key) =>
      phase === "enter" && key === "life" ? { duration: timeout } : config,
  });

  useEffect(() => {
    children((message: string, type: toastType) => {
      setItems((state) => [...state, { id: id++, message, type }]);
    });
  }, []);

  return (
    <div className="message-holder">
      {transitions(({ life, ...style }, item) => (
        <animated.div
          className={`toast ${item.type}`}
          style={style}
          ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
        >
          <animated.div style={{ right: life }} className="life" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (cancelMap.has(item) && life.get() !== "0%")
                cancelMap.get(item)();
            }}
          >
            <Close />
          </button>
          <p className="message">{item.message}</p>
        </animated.div>
      ))}
    </div>
  );
}

export default MessageHolder;

const Close = (): JSX.Element => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15.642 15.642"
  >
    <path
      fill="inherit"
      d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"
    ></path>
  </svg>
);
