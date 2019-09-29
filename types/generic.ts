export interface NullString {
  String: string;
  Valid: boolean;
}

export interface NullInt {
  Int64: number;
  Valid: boolean;
}
export interface RenderItemProps<T> {
  item: T;
  style(index: number, rowHeight: number): any;
  isHighlighted: boolean;
  className?: string;
  setFocus?(index: number): void;
  index: number;
}
export interface nullableFloat {
  Float64: number;
  Valid: boolean;
}

export interface NormalizedCache<T> {
  all: Array<number>;
  normalized: { [key: number]: T };
}

interface HasId {
  id: number;
  cust_id: NullInt;
}

export function normalize<T extends HasId>(array: Array<T>, useCustID = false) {
  let normal: NormalizedCache<T> = {
    all: [],
    normalized: {}
  };
  array.forEach(element => {
    normal.all.push(useCustID ? element.cust_id.Int64 : element.id);
    normal.normalized[useCustID ? element.cust_id.Int64 : element.id] = element;
  });
  return normal;
}
