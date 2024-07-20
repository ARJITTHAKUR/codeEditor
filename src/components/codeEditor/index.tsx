import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { CursorElementBlinker } from "./cursorElement";
import { NewTextRenderer } from "../newTextRenderer";
// what does a code editor has
// lines
// text in line
// formatting
const pixelMovementX = 9.63;
const pixelMovementY = 16;
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
    let textLengthInPrevArrays = splitByNewLine.slice(0, lineIndex);
    function test(){
      console.log("test")
    }
    `);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorIndex, setCursorIndex] = useState(text.length);
  const keyboardFuncRef = useRef<Function>();
  const [cursorBlinkPosition, setCursorBlinkerPosition] = useState({
    x: 0,
    y: 0,
  });
  const cursorBlinkerRef = useRef<HTMLDivElement>(null);
  // const handleMouseClick = (e: React.MouseEvent<HTMLPreElement>) => {
  //   const element = e.target as HTMLSpanElement;
  //   const index = parseInt(element.dataset.indexNumber || `${text.length}`);
  //   setCursorIndex(index);
  // };
  const handleInputkey = (e: KeyboardEvent) => {
    console.log(textareaRef.current?.selectionStart);
    if (e.key === "Meta") return;
    if (e.key === "Shift") {
      return;
    }
    if (e.key === "Backspace") {
      // console.log(cursorBlinkerRef.current?.getBoundingClientRect());
      if (cursorBlinkPosition.x === 0) {
        setCursorBlinkerPosition((prev) => ({
          x: prev.x - pixelMovementX,
          y: prev.y - pixelMovementY,
        }));
        return;
      }
      if (
        cursorBlinkPosition.x ===
        cursorBlinkerRef.current?.getBoundingClientRect().width
      ) {
        setCursorBlinkerPosition((prev) => ({
          x: prev.x + pixelMovementX,
          y: prev.y + pixelMovementY,
        }));

        return;
      }
      setCursorBlinkerPosition((prev) => ({
        x: prev.x - pixelMovementX,
        y: prev.y,
      }));
      return;
    }
    if (e.key === "Enter") {
      let textVal = "";
      textVal = text.slice(0, cursorIndex) + "\n" + text.slice(cursorIndex + 1);
      setText(textVal);
      setCursorBlinkerPosition((prev) => ({
        x: prev.x,
        y: prev.y + pixelMovementY,
      }));
      return;
    }
    if (e.key === "ArrowLeft") {
      setCursorBlinkerPosition((prev) => ({
        x: prev.x - pixelMovementX,
        y: prev.y,
      }));

      return;
    }
    if (e.key === "ArrowRight") {
      setCursorBlinkerPosition((prev) => ({
        x: prev.x + pixelMovementX,
        y: prev.y,
      }));
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Alt") {
      if (e.key === "ArrowDown") {
        setCursorBlinkerPosition((prev) => ({
          x: prev.x,
          y: prev.y + pixelMovementY,
        }));
      }
      if (e.key === "ArrowUp") {
        setCursorBlinkerPosition((prev) => ({
          x: prev.x,
          y: prev.y - pixelMovementY,
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

  const handleTextAreakeyboardEvent = (e: React.KeyboardEvent) => {
    // new way to move the cursor in 2D based on selection movement
    const caretPosition = textareaRef.current?.selectionStart || 0;
    // console.log({ caretPosition });
    let x = 0;
    let y = 0;
    for (let i = 0; i < caretPosition; ++i) {
      if (i <= caretPosition && text[i] === "\n") {
        y += pixelMovementY;
        x = 0;
      } else {
        x += pixelMovementX;
      }
    }
    setCursorBlinkerPosition({ x, y });
  };

  const handleEditorClick = (data: {
    x: number;
    y: number;
    row?: number;
    col?: number;
    pointerToChar?: number;
  }) => {
    console.log({ data });
    if (textareaRef.current) {
      setCursorBlinkerPosition({ x: data.x, y: data.y });
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        data?.pointerToChar || 0,
        data?.pointerToChar || 0
      );
    }
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
      textareaRef.current.setSelectionRange(0, 0);
    }
    textareaRef?.current?.focus();
    // window.addEventListener("keyup", handle);
    return () => {
      // window.removeEventListener("keyup", handle);
    };
  }, []);

  return (
    <div className="border-0.5 border-black p-2 w-full">
      {
        <div className="relative">
          <NewTextRenderer
            text={text}
            // cursorIndex={cursorIndex}
            onClick={(data) => handleEditorClick(data)}
          />
          <CursorElementBlinker
            ref={cursorBlinkerRef}
            x={cursorBlinkPosition.x}
            y={cursorBlinkPosition.y}
          />
        </div>
      }
      <div className="overflow-x-scroll">
        <textarea
          ref={textareaRef}
          name="main-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-black w-full h-auto p-1 overflow-x-scroll"
          rows={text.split("\n").length}
          onKeyUp={(e) => handleTextAreakeyboardEvent(e)}
        />
      </div>
    </div>
  );
};
