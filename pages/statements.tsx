import fetch from "isomorphic-unfetch";
import { NextPage, NextPageContext } from "next";
import { FC, useState, useRef, SyntheticEvent, ChangeEvent } from "react";
import moment from "moment";
import Select from "react-select";
import { Master } from "../types/master";
import {
  NullInt,
  RenderItemProps,
  NormalizedCache,
  normalize,
  GenerateCacheFromAll,
  CreateMasterInterface,
  DeNormalize
} from "../types/generic";
import KeyList from "../components/key-list";
import Dialog from "../components/dialog";
import MasterList from "../components/master-list";
import withPop from "../components/popup";
import StatementTR from "../components/statement-tr";
import { Statement } from "../types/statements";
import {
  postStatementMaster,
  getNewStatements,
  getCompanyStatements,
  getCompanyMasters,
  getCompanyBanks,
  postCreateMasters
} from "../libs/api";
import { Bank } from "../types/bank";
import { Company } from "../types/company";
import Nav from "../components/nav";
import { Group } from "../types/group";
import CreateMaster from "../components/create-master";

interface StatementProps {
  masters: NormalizedCache<Master>;
  statements: NormalizedCache<Statement>;
  banks: NormalizedCache<Bank>;
  companies: NormalizedCache<Company>;
  groups: NormalizedCache<Group>;
}
const StatementFn: NextPage<StatementProps> = props => {
  const [optionTag, setOptionTag] = useState("all");
  const [companyID, setCompanyID] = useState(1);
  const [statements, setStatements] = useState(props.statements);
  const [masters, setMasters] = useState(props.masters);
  const [banks, setBanks] = useState(props.banks);
  const [showDialog, setDialog] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(statements.all[0]);
  const [cursor, setCursor] = useState(0);
  const [showCreateMaster, setCreateMaster] = useState(false);
  const [bankFilter, setBankFilter] = useState(0);

  const handleMasterChange = async (masterID: number) => {
    // console.log("Changing master to:", masterID);
    // console.log()
    let toStatement = statements.normalized[selectedStatement];
    toStatement.cust_id = { Valid: true, Int64: masterID };
    toStatement.master = masters.normalized[masterID];

    let newStatements: NormalizedCache<Statement> = {
      all: statements.all,
      normalized: { ...statements.normalized, [toStatement.id]: toStatement }
    };
    await postStatementMaster({
      cust_id: masterID,
      statement_id: selectedStatement,
      company_id: companyID
    });

    let xMaster = masters.normalized[masterID];
    xMaster.chq_flg = 1;

    let newMaster: NormalizedCache<Master> = {
      all: masters.all,
      normalized: { ...masters.normalized, [xMaster.id]: xMaster }
    };

    setStatements(newStatements);
    setMasters(newMaster);
    setDialog(false);
  };

  const handleStatSelect = (cursor: number) => {
    // console.log("Cursor:", cursor);
    const statement = statements.normalized[statements.all[cursor]];
    // console.log("Statement ID: ", statement.id);
    toggleDialog(statement.id);
  };
  const toggleDialog = (statID: number) => {
    setSelectedStatement(statID);
    // console.log("Showing stat id: ", statID);
    setDialog(true);
  };

  const handleEscape = (_: number, __: string) => {
    setDialog(false);
  };

  const handleHideCompleted = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      filterBank(bankFilter);
    } else {
      // const statements = refetchStatements();
      const newStatementsAll = statements.all.filter(id => {
        if (
          !statements.normalized[id].cust_id.Valid ||
          (statements.normalized[id].cust_id.Valid &&
            statements.normalized[id].cust_id.Int64 == 761)
        )
          return true;
        return false;
      });
      let newStatements: NormalizedCache<Statement> = {
        all: [],
        normalized: {}
      };
      newStatementsAll.forEach(id => {
        newStatements.all.push(id);
        newStatements.normalized[id] = statements.normalized[id];
      });
      setStatements(newStatements);
    }
  };

  const refetchStatements = async () => {
    const data = await getCompanyStatements(companyID);
    const newStatements = data.data.statements;
    const normalizedStatements = normalize<Statement>(newStatements);
    return normalizedStatements;
  };

  const filterBank = async (filterValue: number) => {
    if (filterValue == 0) {
      setStatements(await refetchStatements());
      return;
    }
    // console.log("Filtering the new :", filterValue);
    const statements = await refetchStatements();
    const filterStatements = DeNormalize<Statement>(statements);

    const nwStatements = filterStatements.filter(
      stat => stat.bank.id == filterValue
    );
    const newStatements = normalize<Statement>(nwStatements);

    setStatements(newStatements);
  };

  const handleBankChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    // console.log("Changing bank to :", e.target.value);
    const newBank = e.target.value;
    setBankFilter(parseInt(newBank));
    filterBank(parseInt(newBank));
    setOptionTag(newBank);
  };

  const handleCompanySelect = async (companyID: number) => {
    const statementPacket = await getCompanyStatements(companyID);
    const masterPacket = await getCompanyMasters(companyID);
    const bankPacket = await getCompanyBanks(companyID);

    const sData = await statementPacket.data;
    const mData = await masterPacket.data;
    const bData = await bankPacket.data;

    setStatements(normalize<Statement>(sData.statements));
    const newMs = normalize<Master>(mData.masters, true);
    // console.log(newMs);
    setMasters(newMs);

    setBanks(normalize<Bank>(bData.banks));
    setCompanyID(companyID);
  };

  const handleCreateMaster = async (formData: CreateMasterInterface) => {
    // console.log("showting fata", formData);
    await postCreateMasters(formData);
    const masterPacket = await getCompanyMasters(companyID);
    const mData = await masterPacket.data;
    const newMs = normalize<Master>(mData.masters, true);
    setMasters(newMs);
    setCreateMaster(false);
  };

  return (
    <div>
      <Nav />
      {withPop(
        <CreateMaster
          groups={props.groups}
          toggle={() => {
            setCreateMaster(false);
          }}
          company={props.companies}
          onSave={handleCreateMaster}
        />,
        showCreateMaster
      )}
      <div className="wrapper">
        <div className="config">
          <select
            value={companyID}
            onChange={e => handleCompanySelect(parseInt(e.target.value))}
          >
            {props.companies.all.map(bankID => {
              return (
                <option key={bankID} value={bankID}>
                  {props.companies.normalized[bankID].name}
                </option>
              );
            })}
          </select>
          <select value={optionTag} onChange={handleBankChange}>
            <option value={0}>All</option>
            {banks.all.map(bankID => {
              return (
                <option key={bankID} value={bankID.toString()}>
                  {banks.normalized[bankID].name}
                </option>
              );
            })}
          </select>
          <p className="filters">
            <label>
              <input
                onChange={handleHideCompleted}
                type="checkbox"
                placeholder="Show outstandings"
              />
              Show Outstandings
            </label>
          </p>
        </div>
        <div
          onClick={() => {
            setCreateMaster(true);
          }}
        >
          <button>Create Master</button>
        </div>
        <h1>Statements</h1>
        <KeyList
          key={"Statement"}
          columns={[
            "Date",
            "Narration",
            "Master",
            "Reference",
            "Deposit",
            "Withdrawl",
            "Bank",
            "Company"
          ]}
          handleEnter={handleStatSelect}
          cursor={cursor}
          maxHeight={700}
          numberOfRows={14}
          rowHeight={40}
          data={statements}
          renderItem={(arg: RenderItemProps<Statement>) => {
            return (
              <StatementTR
                key={arg.item.id.toString()}
                statement={statements.normalized[arg.item.id]}
                className={arg.className}
                rowHeight={arg.rowHeight}
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
              companies={props.companies}
            />
          </Dialog>,
          showDialog
        )}
      </div>
      <style jsx>
        {`
          table {
            border-spacing: 2px;
            border-collapse: collapse;
          }
          h1 {
            color: #067df7;
          }
          .wrapper {
            padding: 10px;
          }
          .config {
            padding: 5px;
            display: flex;
            justify-content: flex-start;
          }
          .config > select {
            margin-left: 5px;
          }
          select {
            padding: 1px;
            padding-left: 10px;
            padding-right: 10px;
            font-family: "Open Sans", "Helvetica Neue", "Segoe UI", "Calibri",
              "Arial", sans-serif;
            font-size: 18px;
            color: #60666d;
            background-color: white;
            box-shadow: 0 15px 30px -10px transparentize(#000, 0.9);
          }
          button {
            padding: 5px;
            padding-left: 10px;
            padding-right: 10px;
            font-family: "Open Sans", "Helvetica Neue", "Segoe UI", "Calibri",
              "Arial", sans-serif;
            font-size: 18px;
            background-color: white;
            border: 1px solid #3e3e3f;
            margin-left: 10px;
          }
          button:hover {
            outline: 1px solid blue;
          }
          .filters {
            font-family: "Open Sans", "Helvetica Neue", "Segoe UI", "Calibri",
              "Arial", sans-serif;
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

StatementFn.getInitialProps = async function(arg: NextPageContext) {
  // console.log("Getting inital Props");

  const res = await fetch("http://localhost:8080/masters/1");
  const data = await res.json();

  const statements = await fetch("http://localhost:8080/cstatements/1");
  const sdata = await statements.json();

  const bankRequest = await fetch("http://localhost:8080/banks/1");
  const bankData = await bankRequest.json();

  const companyRequest = await fetch("http://localhost:8080/companies");
  const companyData = await companyRequest.json();

  const groupsRequest = await fetch("http://localhost:8080/groups");
  const groupsData = await groupsRequest.json();

  const normalized = normalize<Statement>(sdata.statements);
  const mNormalized = normalize<Master>(data.masters, true);
  const bankNormalized = normalize<Bank>(bankData.banks);
  const companyNormalized = normalize<Company>(companyData.companies);
  const groupNormalized = normalize<Group>(groupsData.groups);

  // console.log(mNormalized);

  return {
    masters: mNormalized,
    statements: normalized,
    banks: bankNormalized,
    companies: companyNormalized,
    groups: groupNormalized
  };
};

export default StatementFn;
