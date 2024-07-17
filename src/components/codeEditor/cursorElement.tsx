import { forwardRef, useEffect, useRef, useState } from "react";

type CursorBlinkerProps = {
  x: number;
  y: number;
};
export const CursorElementBlinker = forwardRef(
  ({ x, y }: CursorBlinkerProps, ref) => {
    const [toggleDisplay, setToggleDisplay] = useState(true);
    const timerRef = useRef<number>();
    useEffect(() => {
      timerRef.current = setInterval(() => {
        setToggleDisplay((prev) => !prev);
      }, 500);
      return () => {
        clearInterval(timerRef.current);
      };
    }, []);
    return (
      <>
        <div
          // className="animate-ping"
          ref={ref}
          style={{
            visibility: toggleDisplay ? "visible" : "hidden",
            position: "absolute",
            top: y + "px",
            left: x + "px",
            height: "1rem",
            pointerEvents: "none",
          }}
        >
          |
        </div>
      </>
    );
  }
);
