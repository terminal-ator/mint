import KeyList from "./key-list";
import { useState, FC, useRef } from "react";
import { Master } from "../types/master";
import { RenderItemProps, NormalizedCache } from "../types/generic";

interface MasterListProps {
  masters: NormalizedCache<Master>;
  handleEnter?(masterID: number): void;
  handleEscape?(_: number, __: string): void;
}

const MasterList: FC<MasterListProps> = props => {
  const [filter, setFilter] = useState("");
  const [cursor, setCursor] = useState(0);
  const [masters, setMasters] = useState(props.masters);
  // const focusRef = useRef();

  const columns = ["Name"];

  const selectName = (cursor: number) => {
    props.handleEnter(props.masters.all[cursor]);
  };

  const filterBasedOnName = async (filteredString: string) => {
    // console.log("Got filterd string:", filteredString);
    if (filteredString === "") setCursor(0);
    const master = props.masters;

    for (let i = 0; i < master.all.length; i++) {
      if (
        master.normalized[master.all[i]].name
          .toLowerCase()
          .startsWith(filteredString.toLowerCase())
      ) {
        // console.log("Setting cursor:", i);
        setCursor(i);
        break;
      }
    }
  };

  // const filterOut = async (filteredString: string) => {
  //   if (filteredString === "") setMasters(props.masters);
  //   const customFilterAll =
  // };

  const handleKey = async (_: number, key: string) => {
    const newFilter = filter + key;
    // console.log("New filter:", newFilter);
    await filterBasedOnName(newFilter);
    setFilter(newFilter);
  };
  const handleBackSpace = async (_: number, key: string) => {
    const newFilter = filter.slice(0, -1);
    await filterBasedOnName(newFilter);
    setFilter(newFilter);
  };
  function renderItem(arg: RenderItemProps<Master>) {
    // console.log(arg);
    const styleProps =
      arg.isHighlighted && false ? { backgroundColor: "aqua" } : {};
    return (
      <tr
        onMouseEnter={() => arg.setFocus(arg.index)}
        style={{ ...styleProps, ...arg.style }}
        className={arg.className + " " + "item"}
        key={arg.item.id.toString()}
      >
        <td>{arg.item.name}</td>
        <style jsx>
          {`
            @keyframes enter {
              0% {
                background: white;
              }
              100% {
                background: aqua;
              }
            }
            .selected {
              background: aqua;
              border: 1px solid black;
            }
            .item {
              transition: background 0.2s ease-in, border 0.2s ease-in;
              padding: 10px;
            }
          `}
        </style>
      </tr>
    );
  }

  const handleMisc = [
    {
      key: 8,
      handler: handleBackSpace
    },
    {
      key: 27,
      handler: props.handleEscape
    }
  ];

  return (
    <div style={{ height: "100%" }}>
      <h2>{filter || "filter"}</h2>
      <KeyList
        key={"master-list"}
        columns={columns}
        cursor={cursor}
        rowHeight={30}
        numberOfRows={20}
        maxHeight={400}
        handleCharacter={handleKey}
        data={masters}
        renderItem={renderItem}
        handleMisc={handleMisc}
        handleEnter={selectName}
      />
    </div>
  );
};

export default MasterList;
