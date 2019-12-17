import { FC } from "react";
import moment from "moment";
import { StatementLiProps } from "../types/statements";

const StatementTR: FC<StatementLiProps> = ({
  statement,
  master,
  inpRef,
  toggleEnter,
  className,
  rowHeight
}) => {
  // console.log(`Displaying masters ${masters}`);

  return (
    <tr className={className + " item"} style={{ height: rowHeight }}>
      <td>{moment(statement.date).format("LL")}</td>
      <td className="narration-td">{statement.narration}</td>
      <td className="narration-td">
        {(statement.master && statement.master.name) || "No ledger selected"}
      </td>
      <td>{statement.ref_no}</td>
      <td>{(statement.deposit.Valid && statement.deposit.Float64) || 0}</td>
      <td>{(statement.withdrawl.Valid && statement.withdrawl.Float64) || 0}</td>
      <td>{statement.bank.name}</td>
      <td>{statement.company.name}</td>
      <style jsx>
        {`
          table {
            border-collapse: collapse;
          }
          td {
            min-width: 150px;
            max-width: 150px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid black;
            border-collapse: collapse;
            overflow: hidden;
          }
          tr {
            padding: 5px;
          }
          .narration-td {
            overflow: hidden;
            max-width: 400px;
            min-width: 400px;
            padding-left: 10px;
            padding-right: 10px;
          }
          .narration-td:hover {
            overflow-x: scroll;
          }
          @keyframes enter {
            0% {
              background: white;
            }
            100% {
              background: aqua;
            }
          }
          .selected {
            background: #713dc9;
            color: white;
          }
          .item {
            transition: background 0.05s ease-in, border 0.05s ease-in;
            padding: 10px;
          }
        `}
      </style>
      <style jsx>{``}</style>
    </tr>
  );
};

export default StatementTR;
