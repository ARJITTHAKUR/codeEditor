// what does a code editor has
// lines
// text in line
// formatting

import React, { useEffect, useRef, useState, KeyboardEvent } from "react";

// highlighting
export const CodeEditor = () => {
  //   const [text, setText] =
  //     useState(`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel, eligendi
  //           doloribus velit repellendus cumque veritatis autem!
  //     amet et?`);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | undefined>(null);
  const [cursorIndex, setCursorIndex] = useState(text.length);
  const keyboardFuncRef = useRef<Function>();

  const handleMouseClick = (e: React.MouseEvent<HTMLPreElement>) => {
    // console.log(e.target);
    const element = e.target as HTMLSpanElement;
    const index = parseInt(element.dataset.indexNumber || `${text.length}`);
    // console.log({ index });
    setCursorIndex(index);
  };
  const handleInputkey = (e: KeyboardEvent) => {
    // const charCode = e.key.charCodeAt(0);
    if (e.key === "Shift") {
      return;
    }
    if (e.key === "Backspace") {
      let textVal = "";
      textVal = text.slice(0, cursorIndex) + text.slice(cursorIndex + 1);
      setText(textVal);
      setCursorIndex((prev) => prev - 1);
      return;
    }
    if (e.key === "Enter") {
      let textVal = "";
      textVal = text.slice(0, cursorIndex) + "\n" + text.slice(cursorIndex + 1);
      setText(textVal);
      setCursorIndex((prev) => prev + 1);
      return;
    }
    if (e.key === "ArrowLeft") {
      setCursorIndex((prev) => prev - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      setCursorIndex((prev) => prev + 1);
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Alt") {
      return;
    }
    // let textVal = [...text];
    // textVal.splice(cursorIndex, 0, e.key);
    // setText(textVal.join(""));
    // setCursorIndex((prev) => prev + 1);
    // textVal.plice(cursorIndex, 0, e.key);
    let textVal = "";
    textVal = text.slice(0, cursorIndex) + e.key + text.slice(cursorIndex + 1);
    setText(textVal);
    setCursorIndex((prev) => prev + 1);
  };
  keyboardFuncRef.current = handleInputkey;
  useEffect(() => {
    const handle = (e) => {
      if (keyboardFuncRef.current) {
        keyboardFuncRef.current(e);
      }
    };
    window.addEventListener("keyup", handle);
    return () => {
      console.log("removed");
      window.removeEventListener("keyup", handle);
    };
  }, []);

  return (
    <div className="border-0.5 border-black p-2 w-full">
      <pre className="" onClick={handleMouseClick}>
        {<TextRenderer text={text} cursorIndex={cursorIndex} />}
        <div>
          <textarea
            ref={textareaRef}
            key={text}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-black w-full h-auto"
          ></textarea>
        </div>
      </pre>
    </div>
  );
};

const TextRenderer = ({
  text,
  cursorIndex,
}: {
  text: string;
  cursorIndex: number;
}) => {
  const [cursor, setCursor] = useState(null);
  let jsx: any = null;
  //   const arrOfSpan: string[] = [""];
  let arrOfSpan = "";
  let inx = 0;
  for (let i = 0; i < text.length; ++i) {
    // if (text.charCodeAt(i) === 32 || text.charCodeAt(i) === 190) {
    //   inx += 1;
    //   arrOfSpan.push("");
    // } else {
    //   arrOfSpan[inx] = arrOfSpan[inx] + text[i];
    // }
    arrOfSpan = text;
  }
  //   console.log(arrOfSpan);
  jsx = [];
  for (let i = 0; i < arrOfSpan.length; ++i) {
    if (i === cursorIndex) {
      jsx.push(<CursorElement />);
    }
    const span = (
      <span className=" bg-slate-300" key={i} data-index-number={i}>
        {arrOfSpan[i]}
      </span>
    );

    jsx.push(span);
  }
  if (cursorIndex == text.length) {
    jsx.push(<CursorElement />);
  }
  return jsx;
};

const CursorElement = () => {
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
      <span style={{ visibility: toggleDisplay ? "visible" : "hidden" }}>
        |
      </span>
    </>
  );
};
