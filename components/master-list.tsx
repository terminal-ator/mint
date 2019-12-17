import KeyList from "./key-list";
import { useState, FC, useRef, useEffect } from "react";
import { Master } from "../types/master";
import {
  RenderItemProps,
  NormalizedCache,
  GenerateCacheFromAll
} from "../types/generic";
import { Company } from "../types/company";

interface MasterListProps {
  masters: NormalizedCache<Master>;
  handleEnter?(masterID: number): void;
  handleEscape?(_: number, __: string): void;
  companies?: NormalizedCache<Company>;
}

const MasterList: FC<MasterListProps> = props => {
  const [filter, setFilter] = useState("");
  const [cursor, setCursor] = useState(0);
  const [masters, setMasters] = useState(props.masters);
  // const focusRef = useRef();
  useEffect(() => {
    setMasters(props.masters);
  }, [props.masters]);

  const columns = [filter];

  const selectName = (cursor: number) => {
    props.handleEnter(props.masters.all[cursor]);
  };

  const filterBasedOnCompany = async (companyID: number) => {
    if (companyID === 0) {
      setMasters(props.masters);
      return;
    }

    const newAll = masters.all.filter(
      id => props.masters.normalized[id].company_id == companyID
    );

    const newMasters = GenerateCacheFromAll<Master>(props.masters, newAll);
    setMasters(newMasters);
  };

  const filterBasedOnName = async (filteredString: string) => {
    // console.log("Got filterd string:", filteredString);
    if (filteredString === "") {
      setCursor(0);
      return 0;
    }
    const master = masters;

    for (let i = 0; i < master.all.length; i++) {
      if (
        master.normalized[master.all[i]].name
          .toLowerCase()
          .startsWith(filteredString.toLowerCase())
      ) {
        // console.log("Setting cursor:", i);
        setCursor(i);
        return 0;
      }
    }
    return 1;
  };

  // const filterOut = async (filteredString: string) => {
  //   if (filteredString === "") setMasters(props.masters);
  //   const customFilterAll =
  // };

  const handleKey = async (_: number, key: string) => {
    const newFilter = filter + key;
    // console.log("New filter:", newFilter);
    const val = await filterBasedOnName(newFilter);
    if (val == 0) setFilter(newFilter);
    else setFilter(filter);
  };
  const handleBackSpace = async (_: number, key: string) => {
    const newFilter = filter.slice(0, -1);
    await filterBasedOnName(newFilter);
    setFilter(newFilter);
  };
  function renderItem(arg: RenderItemProps<Master>) {
    // console.log(arg);
    return (
      <tr
        onMouseEnter={() => arg.setFocus(arg.index)}
        style={{ ...arg.style }}
        className={arg.className + " " + "item"}
        key={arg.item.id.toString()}
      >
        <td style={{ padding: 5 }}>
          <span>
            {arg.item.chq_flg ? <span className="chq-flg">&nbsp; </span> : null}
            &nbsp;
            <span>{arg.item.name}</span>
          </span>
        </td>
        <style jsx>
          {`
            @keyframes enter {
              0% {
                background: white;
              }
              100% {
                background: #067df7;
              }
            }
            .selected {
              background: #067df7;
              color: white;
            }
            .chq-flg {
              background-color: #53c97c;
              width: 5px;
            }
            .item {
               {
                /* transition: background 0.2s ease-in, border 0.2s ease-in; */
              }
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
      <p className="filter-text">{filter || "filter"}</p>
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
      <style jsx>
        {`
          .filter-text {
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default MasterList;
