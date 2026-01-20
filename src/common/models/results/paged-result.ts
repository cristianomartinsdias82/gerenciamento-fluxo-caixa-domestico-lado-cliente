import type { QueryParams } from "../searching/query-params";

export type PagedResult<T>
{
	queryParams: QueryParams
	items: T[];
	itemCount: number;
	pageCount: number;
	nextPage?: number;
	previousPage?: number;
}