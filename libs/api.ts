import axios from "axios";
import { CreateMasterInterface } from "../types/generic";

const SERVER_URL = "http://localhost:8080";

interface StatementMaster {
  statement_id: number;
  cust_id: number;
  company_id: number;
}

export const postStatementMaster = async (arg: StatementMaster) => {
  return axios.post(SERVER_URL + "/statements", arg);
};

export const getNewStatements = async (bank_id: string) => {
  return axios.get(SERVER_URL + `/statements/${bank_id}`);
};

export const getCompanyStatements = async (company_id: number) => {
  return axios.get(SERVER_URL + `/cstatements/${company_id}`);
};

export const getCompanyMasters = async (company_id: number) => {
  return axios.get(SERVER_URL + `/masters/${company_id}`);
};

export const getCompanyBanks = async (company_id: number) => {
  return axios.get(SERVER_URL + `/banks/${company_id}`);
};

export const postCreateMasters = async (packet: CreateMasterInterface) => {
  return axios.post(SERVER_URL + "/masters", packet);
};
