export type QueryParams = 
{
	pageNumber: number;
	pageSize: number;
	sortBy?: string;
	sortDirection?: string;
    searchTerm?: string | null;
    fieldToSearchBy?: string;
};