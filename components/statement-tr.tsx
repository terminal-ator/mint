import { FC } from "react";
import moment from "moment";
import { StatementLiProps } from "../types/statements";

const StatementTR: FC<StatementLiProps> = ({
  statement,
  master,
  inpRef,
  toggleEnter,
  className
}) => {
  // console.log(`Displaying masters ${masters}`);

  return (
    <tr className={className}>
      <td>{moment(statement.date).format("LL")}</td>
      <td className="narration-td">{statement.narration}</td>
      <td>
        {(statement.master && statement.master.name) || "No ledger selected"}
      </td>
      <td>{statement.ref_no}</td>
      <td>{(statement.deposit.Valid && statement.deposit.Float64) || 0}</td>
      <td>{(statement.withdrawl.Valid && statement.withdrawl.Float64) || 0}</td>
      <td>{statement.bank.name}</td>
      <style jsx>
        {`
          table {
            border-collapse: collapse;
          }
          td {
            min-width: 200px;
            max-width: 200px;
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
            max-width: 600px;
            min-width: 600px;
            padding-left: 10px;
            padding-right: 10px;
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
            background: #4c4d45;
            color: white;
            border: 1px solid black;
          }
          .item {
            transition: background 0.2s ease-in, border 0.2s ease-in;
            padding: 10px;
          }
        `}
      </style>
      <style jsx>{``}</style>
    </tr>
  );
};

export default StatementTR;
