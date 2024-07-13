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
      console.log("backspace");
      setCursorBlinkerPosition((prev) => ({
        x: prev.x,
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
      // setCursorIndex((prev) => prev + 1);
      return;
    }
    if (e.key === "ArrowLeft") {
      // setCursorIndex((prev) => prev - 1);
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

  const handleTextAreakeyboardEvent = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const caretPosition = textareaRef.current?.selectionStart;
    // console.log({ caretPosition });
    setCursorIndex(caretPosition || text.length);
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
      // textareaRef.current.selectionStart = data.row;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        data.pointerToChar,
        data.pointerToChar
      );
      // console.log(textareaRef.current.selectionStart);
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
    window.addEventListener("keyup", handle);
    return () => {
      window.removeEventListener("keyup", handle);
    };
  }, []);

  return (
    <div className="border-0.5 border-black p-2 w-full">
      {/* <pre className="" onClick={handleMouseClick}> */}
      {/* {<TextRenderer text={text} cursorIndex={cursorIndex} />} */}
      {
        <div className="relative">
          <NewTextRenderer
            text={text}
            // cursorIndex={cursorIndex}
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
          // value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-black w-full h-auto p-1"
          onClick={(e) => {
            // handleSelection(e);
            handleTextAreakeyboardEvent(e);
          }}
          rows={text.split("\n").length}
          onKeyUp={(e) => handleTextAreakeyboardEvent(e)}
          onKeyDown={(e) => handleTextAreakeyboardEvent(e)}
        >
          {text}
        </textarea>
        {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
      </div>
      {/* </pre> */}
    </div>
  );
};
