import type { TransactionType } from "./transaction-type";

export type RegisteredTransaction = {
    id: string;
    personId: string;
    categoryId: string
    type: TransactionType;
    description: string;
    amount: number;
};