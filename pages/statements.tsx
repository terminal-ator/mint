import fetch from "isomorphic-unfetch";
import { NextPage } from "next";
import { FC, useState, useRef } from "react";
import moment from "moment";
import Select from "react-select";
import { Master } from "../types/master";
import {
  NullInt,
  RenderItemProps,
  NormalizedCache,
  normalize
} from "../types/generic";
import KeyList from "../components/key-list";
import Dialog from "../components/dialog";
import MasterList from "../components/master-list";
import withPop from "../components/popup";
import StatementTR from "../components/statement-tr";
import { Statement } from "../types/statements";

interface StatementProps {
  masters: NormalizedCache<Master>;
  statements: NormalizedCache<Statement>;
}
const StatementFn: NextPage<StatementProps> = props => {
  const [statements, setStatements] = useState(props.statements);
  const [masters, setMasters] = useState(props.masters);
  const [showDialog, setDialog] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(statements.all[0]);
  const [cursor, setCursor] = useState(0);

  const handleMasterChange = (masterID: number) => {
    console.log("Changing master to:", masterID);
    // console.log()
    let toStatement = statements.normalized[selectedStatement];
    toStatement.cust_id = { Valid: true, Int64: masterID };
    toStatement.master = masters.normalized[masterID];

    let newStatements: NormalizedCache<Statement> = {
      all: statements.all,
      normalized: { ...statements.normalized, [toStatement.id]: toStatement }
    };
    setStatements(newStatements);
    setDialog(false);
  };

  const handleStatSelect = (cursor: number) => {
    console.log("Cursor:", cursor);
    const statement = statements.normalized[statements.all[cursor]];
    console.log("Statement ID: ", statement.id);
    toggleDialog(statement.id);
  };
  const toggleDialog = (statID: number) => {
    setSelectedStatement(statID);
    console.log("Showing stat id: ", statID);
    setDialog(true);
  };

  const handleEscape = (_: number, __: string) => {
    setDialog(false);
  };

  return (
    <div>
      <h1>Statements</h1>
      <KeyList
        key={"Statement"}
        columns={[
          "Date",
          "Narration",
          "Master",
          "Reference",
          "Deposit",
          "Withdrawl"
        ]}
        handleEnter={handleStatSelect}
        cursor={cursor}
        maxHeight={700}
        numberOfRows={20}
        rowHeight={20}
        data={statements}
        width="100%"
        renderItem={(arg: RenderItemProps<Statement>) => {
          return (
            <StatementTR
              key={arg.item.id.toString()}
              statement={statements.normalized[arg.item.id]}
              className={arg.className}
            />
          );
        }}
      />
      {withPop(
        <Dialog>
          <MasterList
            handleEscape={handleEscape}
            handleEnter={handleMasterChange}
            masters={masters}
          />
        </Dialog>,
        showDialog
      )}

      <style jsx>
        {`
          table {
            border-spacing: 10px;
            border-collapse: collapse;
          }
        `}
      </style>
    </div>
  );
};

StatementFn.getInitialProps = async function() {
  // console.log("Getting inital Props");

  const res = await fetch("http://localhost:8080/masters");
  const data = await res.json();

  const statements = await fetch("http://localhost:8080/statements");
  const sdata = await statements.json();

  const normalized = normalize<Statement>(sdata.statements);
  const mNormalized = normalize<Master>(data.masters, true);

  console.log(mNormalized);

  return {
    masters: mNormalized,
    statements: normalized
  };
};

export default StatementFn;
