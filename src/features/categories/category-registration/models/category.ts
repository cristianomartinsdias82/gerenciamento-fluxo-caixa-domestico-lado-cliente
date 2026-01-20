import type { CategoryPurpose } from "./category-purpose";

export type Category = {
    name: string;
    purpose: CategoryPurpose;
    description?: string;
};