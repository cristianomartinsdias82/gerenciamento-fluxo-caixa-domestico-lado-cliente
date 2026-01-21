import type { CategoryPurpose } from "./category-purpose";

export type Category = {
    id: string;
    name: string;
    purpose: CategoryPurpose;
    description?: string;
};