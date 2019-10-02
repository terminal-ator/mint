import { Master } from "./master";
import { NullInt, nullableFloat, NormalizedCache } from "./generic";
import { MutableRefObject } from "react";
import { Bank } from "./bank";

export interface Statement {
  id: number;
  narration: string;
  date: string;
  ref_no: string;
  created_at: string;
  cust_id: NullInt;
  deposit: nullableFloat;
  withdrawl: nullableFloat;
  master: Master;
  bank: Bank;
}

export interface StatementLiProps {
  statement: Statement;
  master?: Master;
  setMaster?(statementID: number, masterID: number): void;
  inpRef?: MutableRefObject<any>;
  toggleEnter?(id: number): void;
  className?: string;
}
