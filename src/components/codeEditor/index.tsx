import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { CursorElementBlinker } from "./cursorElement";
// what does a code editor has
// lines
// text in line
// formatting
const pixelMovement = 16;
export const CodeEditor = () => {
  const [text, setText] = useState(`const array1 = [1, 2, 3, 4];

    // 0 + 1 + 2 + 3 + 4
    const initialValue = 0;
    const sumWithInitial = array1.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue,
    );
    
    console.log(sumWithInitial);
    // Expected output: 10
    let textLengthInPrevArrays = splitByNewLine.slice(0, lineIndex);`);
  //   const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorIndex, setCursorIndex] = useState(text.length);
  const keyboardFuncRef = useRef<Function>();
  const [cursorBlinkPosition, setCursorBlinkerPosition] = useState({
    x: 0,
    y: 0,
  });
  const handleMouseClick = (e: React.MouseEvent<HTMLPreElement>) => {
    const element = e.target as HTMLSpanElement;
    const index = parseInt(element.dataset.indexNumber || `${text.length}`);
    setCursorIndex(index);
  };
  const handleInputkey = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      return;
    }
    if (e.key === "Backspace") {
      let textVal = "";
      textVal = text.slice(0, cursorIndex - 1) + text.slice(cursorIndex + 1);
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
      // setCursorIndex((prev) => prev - 1);
      setCursorBlinkerPosition((prev) => ({
        x: prev.x - pixelMovement,
        y: prev.y,
      }));

      return;
    }
    if (e.key === "ArrowRight") {
      // setCursorIndex((prev) => prev + 1);
      setCursorBlinkerPosition((prev) => ({
        x: prev.x + pixelMovement,
        y: prev.y,
      }));
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Alt") {
      if (e.key === "ArrowDown") {
        setCursorBlinkerPosition((prev) => ({
          x: prev.x * pixelMovement,
          y: prev.y + pixelMovement,
        }));
      }
      if (e.key === "ArrowUp") {
        setCursorBlinkerPosition((prev) => ({
          x: prev.x,
          y: prev.y - pixelMovement,
        }));
      }
      return;
    }
    let textVal = "";
    setCursorIndex((prev) => prev + 1);
    textVal = text.slice(0, cursorIndex) + e.key + text.slice(cursorIndex + 1);
    setText(textVal);
  };
  const handleSelection = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    console.group();
    console.log(e);
    console.log(textareaRef.current?.selectionStart);
    console.groupEnd();
  };

  const handleTextAreakeyboardEvent = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const caretPosition = textareaRef.current?.selectionStart;
    // console.log({ caretPosition });
    setCursorIndex(caretPosition || text.length);
  };

  const handleEditorClick = (
    data:
      | {
          x: number;
          y: number;
          width: number;
          height: number;
          top: number;
          right: number;
          bottom: number;
          left: number;
        }
      | {
          x: number;
          y: number;
        }
  ) => {
    console.log({ data });
    setCursorBlinkerPosition({ x: data.x, y: data.y });
  };
  keyboardFuncRef.current = handleInputkey;
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (keyboardFuncRef.current) {
        keyboardFuncRef.current(e);
      }
    };
    if (textareaRef.current) {
      textareaRef?.current?.focus();
      textareaRef.current.selectionStart = 0;
    }
    textareaRef?.current?.focus();
    window.addEventListener("keyup", handle);
    return () => {
      window.removeEventListener("keyup", handle);
    };
  }, []);

  // useEffect(() => {
  //   if (textareaRef.current) {
  //     textareaRef.current.selectionStart = 0;
  //   }
  // }, [textareaRef.current]);

  return (
    <div className="border-0.5 border-black p-2 w-full">
      {/* <pre className="" onClick={handleMouseClick}> */}
      {/* {<TextRenderer text={text} cursorIndex={cursorIndex} />} */}
      {
        <div className="relative">
          <NewTextRenderer
            text={text}
            cursorIndex={cursorIndex}
            onClick={(data) => handleEditorClick(data)}
          />
          <CursorElementBlinker
            x={cursorBlinkPosition.x}
            y={cursorBlinkPosition.y}
          />
        </div>
      }
      <div>
        <textarea
          ref={textareaRef}
          //   key={text}
          name="main-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-black w-full h-auto"
          onClick={(e) => {
            // handleSelection(e);
            handleTextAreakeyboardEvent(e);
          }}
          rows={text.split("\n").length}
          onKeyUp={(e) => handleTextAreakeyboardEvent(e)}
          onKeyDown={(e) => handleTextAreakeyboardEvent(e)}
        ></textarea>
        {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
      </div>
      {/* </pre> */}
    </div>
  );
};

const NewTextRenderer = ({
  text,
  cursorIndex,
  onClick,
}: {
  text: string;
  cursorIndex: number;
  onClick: (data: any) => void;
}) => {
  const splitByNewLine = text.split("\n");
  const getIndex = (lineIndex: number, textColumnIndex: number) => {
    //  unique index == lineIndex * 10 +
    //             textcolumnInd +
    //             splitByNewLine[lineIndex].length + sum of previous lengths
    let textLengthInPrevArrays = splitByNewLine.slice(0, lineIndex);
    let index = 0;

    return index;
  };
  const handleTextClick = (e: React.MouseEvent<HTMLPreElement>) => {
    console.log(e.currentTarge);
    console.log(e.currentTarget.offsetParent?.getBoundingClientRect());
    // console.log(e.currentTarget.getBoundingClientRect());
    const parent = e.currentTarget?.offsetParent?.getBoundingClientRect();
    // const self = e.currentTarget.getBoundingClientRect();
    // const x = self.y / self.top - parent.y / parent?.top;
    // const y = self.x / self.left - parent.x / parent.left;
    const x = parent.x;
    const y = parent.y;
    // onClick(e.currentTarget.getBoundingClientRect());
    onClick({ x, y });
  };
  return (
    <div className="border border-black flex flex-col my-4 ">
      {splitByNewLine.map((lines, lineIndex) => (
        <pre
          key={lineIndex}
          className="h-4 block"
          onClick={(e) => handleTextClick(e)}
        >
          {lines.split("").map((text, textcolumnInd) => (
            <span key={textcolumnInd} className="h-4">
              {/* {cursorIndex === getIndex(lineIndex, textcolumnInd) ? (
                <CursorElement />
              ) : null} */}
              {text}
            </span>
          ))}
        </pre>
      ))}
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

  arrOfSpan = text;
  //   console.log(arrOfSpan);
  jsx = [];
  for (let i = 0; i < text.length; ++i) {
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
  //   for (let newLines = 0, charCounter = 0; charCounter < text.length; ) {
  //     const spansForCurrentLine = [];
  //     for (
  //       let i = charCounter;
  //       text[i] !== "\n" || i <= text.length;
  //       ++i, ++charCounter
  //     ) {
  //       const span = <span>{text[i]}</span>;
  //       spansForCurrentLine.push(span);
  //     }
  //     const linePreJsx = <pre>{spansForCurrentLine}</pre>;
  //     jsx.push(linePreJsx);
  //     // linePreJsx[newLines].push(spansForCurrentLine);
  //     ++newLines;
  //   }
  //   let newLines = 0;
  //   let charCounter = 0;
  //   while (charCounter < text.length) {
  //     const spansForCurrentLine = [];
  //     for (let i = charCounter; text[i] !== "\n"; ++i, ++charCounter) {
  //       const span = <span>{text[i]}</span>;
  //       spansForCurrentLine.push(span);
  //     }
  //     const linePreJsx = <pre>{spansForCurrentLine}</pre>;
  //     jsx.push(linePreJsx);
  //     // linePreJsx[newLines].push(spansForCurrentLine);
  //     ++newLines;
  //   }
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
