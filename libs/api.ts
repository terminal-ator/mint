import axios from "axios";

const SERVER_URL = "http://localhost:8080";

interface StatementMaster {
  statement_id: number;
  cust_id: number;
}

export const postStatementMaster = async (arg: StatementMaster) => {
  return axios.post(SERVER_URL + "/statements", arg);
};
