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
      <td>{statement.narration}</td>
      <td>
        {(statement.master && statement.master.name) || "No ledger selected"}
      </td>
      <td>{statement.ref_no}</td>
      <td>{(statement.deposit.Valid && statement.deposit.Float64) || 0}</td>
      <td>{(statement.withdrawl.Valid && statement.withdrawl.Float64) || 0}</td>
      <style jsx>
        {`
          td {
            min-width: 200px;
            text-align: center;
            vertical-align: middle;
          }
          tr {
            border-bottom: 1px solid black;
            padding: 5px;
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
            background: aqua;
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
