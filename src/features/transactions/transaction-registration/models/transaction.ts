import type { TransactionType } from "./transaction-type";

export type Transaction = {
    personId: string;
    categoryId: string
    amount: number;
    type: TransactionType;
    description: string;
};