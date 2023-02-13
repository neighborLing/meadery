export type DataItem = {
    lendingInstitution: string;
    amount?: number;
    pay: number;
    payDay: number;
};

export type Data = Array<DataItem>;