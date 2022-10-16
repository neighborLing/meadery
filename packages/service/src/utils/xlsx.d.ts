export type SheetObject = {
  name: string;
  data: SheetContent;
}
export type RowContent = Array<string>;
export type SheetContent = Array<RowContent>;

export type OutParams = {
  content: SheetContent,
  titles: RowContent
};

export type XlsxObject = {
  [propName: string]: string | null
};

export type XlsxData = Array<XlsxObject>;