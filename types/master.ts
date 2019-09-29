import { NullString, NullInt } from "./generic";

export interface Master {
  id: number;
  cust_id: NullInt;
  is_master: boolean;
  name: string;
  address: NullString;
  Area: NullString;
  CreatedAt: NullString;
}
