import { FC, useState, useEffect, useRef } from "react";
import { RenderItemProps, NormalizedCache } from "../types/generic";

interface KeyProps<T> {
  cursor?: number;
  data: NormalizedCache<T>;
  renderItem(arg: any): any;
  columns: Array<string>;
  rowHeight: number;
  numberOfRows: number;
  maxHeight: number;
  handleCharacter?(cursor: number, val: string): void;
  handleEnter?(cursor: number): void;
  handleMisc?: { key: number; handler: (cursor: number, e: string) => void }[];
  width?: string;
}

function KeyList<T>(props: KeyProps<T>) {
  const [cursor, setCursor] = useState(props.cursor);
  const prevCursor = usePrevious(cursor);
  const [lowerCursorBound, setLoweCursorBound] = useState(props.cursor);
  const [upperCursorBound, setUpperCursorBound] = useState(
    props.cursor + props.numberOfRows
  );
  // console.log("Current cursors bound:", lowerCursorBound, upperCursorBound);

  useEffect(() => {
    setCursor(props.cursor);
  }, [props.cursor]);
  // console.log("Getting cursor in keylist", cursor, props.cursor);

  useEffect(() => {
    const jumpFactor = cursor - prevCursor > 1 ? props.numberOfRows / 2 - 3 : 0;
    if (cursor > upperCursorBound) {
      setUpperCursorBound(cursor + jumpFactor);
      setLoweCursorBound(cursor - props.numberOfRows + jumpFactor);
      return;
    }
    if (cursor < lowerCursorBound) {
      setLoweCursorBound(cursor - jumpFactor);
      setUpperCursorBound(cursor + props.numberOfRows - jumpFactor);
      return;
    }
  }, [cursor]);

  function usePrevious(value): number {
    const ref = useRef();

    useEffect(() => {
      ref.current = value;
    }, [value]);

    return ref.current;
  }

  const Focus = useRef(null);
  useEffect(() => {
    Focus.current.focus();
  });

  const [totalheight, setTotalHeight] = useState(
    props.rowHeight * props.numberOfRows + props.rowHeight + 41 || 800
  );
  const [maxHeight, setMaxHeight] = useState(props.maxHeight || 600);

  const styles = {
    wrapper: {
      height: totalheight,
      backgroundColor: "#fff",
      zIndex: 999,
      position: "relative" as "relative",
      top: 0,
      bottom: 0
    },
    listWrapper: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "hidden" as "hidden",
      position: "absolute" as "absolute",
      height: totalheight,
      backgroundColor: "#fff",
      width: props.width,
      padding: 10
    },
    list: (height: number) => ({
      height,
      position: "relative" as "relative",
      overflow: "hidden" as "hidden"
    }),
    item: (index, height) => ({
      height,
      left: 0,
      right: 0,
      top: 0,
      position: "relative" as "relative"
    })
  };

  const checkIfVisible = (index: number): boolean => {
    if (lowerCursorBound <= index && index <= upperCursorBound) return true;
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.keyCode == 38 && cursor > 0) {
      setCursor(cursor - 1);
    }
    if (e.keyCode == 40 && cursor < props.data.all.length - 1) {
      setCursor(cursor + 1);
    }

    // handle page up
    if (e.keyCode == 33 && cursor > 0) {
      if (cursor - props.numberOfRows < 0) {
        setCursor(0);
      } else {
        setCursor(cursor - props.numberOfRows);
      }
    }

    // handle Page down
    if (e.keyCode == 34 && cursor < props.data.all.length - 1) {
      if (cursor + props.numberOfRows > props.data.all.length) {
        setCursor(props.data.all.length - 1);
      } else {
        setCursor(cursor + props.numberOfRows);
      }
    }

    // character code logic
    if (
      props.handleCharacter &&
      ((e.keyCode > 47 && e.keyCode < 91) ||
        e.keyCode === 32 ||
        e.keyCode == 190 ||
        e.keyCode == 188)
    ) {
      const val = e.key.toString();
      props.handleCharacter(cursor, val);
    }

    // handle Enter
    if (e.keyCode === 13) {
      if (props.handleEnter) {
        props.handleEnter(cursor);
      }
    }

    // handle misc
    if (props.handleMisc) {
      props.handleMisc.map(async pair => {
        if (e.keyCode === pair.key) {
          pair.handler(cursor, e.key);
        }
      });
    }
  };

  const handleHover = (newCursor: number) => {
    setCursor(newCursor);
  };

  // console.log(props.data);

  return (
    <div style={styles.wrapper}>
      <div
        onKeyDown={handleKeyDown}
        ref={Focus}
        tabIndex={0}
        style={styles.listWrapper}
      >
        <table>
          <thead>
            <tr style={{ height: props.rowHeight }}>
              {props.columns.map(column_name => (
                <th key={column_name}>{column_name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.all.map((itemid, i) => {
              return checkIfVisible(i)
                ? props.renderItem({
                    item: props.data.normalized[itemid],
                    isHighlighted: cursor === i,
                    style: styles.item(i, props.rowHeight),
                    className: cursor === i ? "selected" : "",
                    setFocus: handleHover,
                    index: i,
                    rowHeight: props.rowHeight
                  })
                : null;
            })}
          </tbody>
        </table>
      </div>
      <style jsx>
        {`
          table {
            table-layout: fixed;
            white-space: nowrap;
            border-collapse: collapse;
          }
          .selected {
            backgroundcolor: aqua;
          }
        `}
      </style>
    </div>
  );
}

export default KeyList;
