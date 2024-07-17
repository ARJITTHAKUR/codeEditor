type ClickData = {
  x: number;
  y: number;
  row?: number;
  col?: number;
  pointerToChar: number;
};

export const NewTextRenderer = ({
  text,
  cursorIndex,
  onClick,
}: {
  text: string;
  cursorIndex?: number;
  onClick: (data: ClickData) => void;
}) => {
  const splitByNewLine = text.split("\n");

  const handleTextClick = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement;
    const parent = e.currentTarget?.offsetParent?.getBoundingClientRect();
    // if (element.tagName === "PRE") {
    //   // this means that put the cursor on the end of the line
    //   const row = parseInt(element.dataset.rowId || 0);
    //   const rowLength = splitByNewLine[row];
    //   onclick({});
    // }
    if (
      element.tagName === "SPAN" &&
      element.dataset.rowId &&
      element.dataset.colId
    )
      if (parent?.x && parent?.y && e.currentTarget.dataset.rowId) {
        const x = element.getBoundingClientRect().x - 1;
        const y = parseInt(element.dataset.rowId) * 16;
        const row = parseInt(element.dataset.rowId);
        const col = parseInt(element.dataset.colId);
        console.log({ row, col });
        let chars = 0;
        // add all the chars from the row before
        for (let i = 0; i < row - 1; ++i) {
          chars += splitByNewLine[row].length;
        }
        let newlinechars = row;
        console.log({ newlinechars });
        // add all the chars from the current row
        const pointerToChar = chars + col + newlinechars;

        // let caratIndex = 0;
        // for(let i = 0; i < row;)
        console.log({ x, y, row, col, pointerToChar });
        onClick({ x, y, row, col, pointerToChar });
      }
  };
  return (
    <div className="border border-black flex flex-col my-4 ">
      {splitByNewLine.map((lines, lineIndex) => (
        <pre
          key={lineIndex}
          className="h-4 w-1 block"
          data-row-id={lineIndex}
          onClick={(e) => handleTextClick(e)}
        >
          {lines.split("").map((text, textcolumnInd) => (
            <span
              key={textcolumnInd}
              className="h-4 bg-slate-200"
              data-row-id={lineIndex}
              data-col-id={textcolumnInd}
              // data-carat-pos={}
            >
              {text}
            </span>
          ))}
        </pre>
      ))}
    </div>
  );
};
