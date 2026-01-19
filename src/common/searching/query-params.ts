export type QueryParams = 
{
	sortBy: string;
	sortDirection: string;
	pageNumber: number;
	pageSize: number;
    searchTerm?: string;
    fieldToSearchBy?: string;
};