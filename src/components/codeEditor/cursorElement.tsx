import { useEffect, useRef, useState } from "react";

export const CursorElementBlinker = ({ x, y }: { x: number; y: number }) => {
  const [toggleDisplay, setToggleDisplay] = useState(true);
  const timerRef = useRef();
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
      <span
        // className="animate-ping"
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
      </span>
    </>
  );
};
