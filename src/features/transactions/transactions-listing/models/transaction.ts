import type { Category } from "./category";
import type { Person } from "./person";

export type Transaction = {
    id: string;
    person: Person;
    category: Category;
    type: string;
    description: string;
    amount: number;
    date: string;
};