import { useEffect, useRef, useState } from "react";
import type { Category } from "../models/category";
import type { PagedResult } from "../../../../common/models/results/paged-result";
import type { QueryParams } from "../../../../common/models/searching/query-params";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const mountQueryParams = (query: QueryParams) => `pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&searchTerm=${encodeURIComponent(query.searchTerm ?? '')}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useCategoryListing = (deps?: any) => {

    const [pagedResult, setPagedResult] = useState<PagedResult<Category> | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [queryParams, setQueryParams] = useState<QueryParams>({ pageNumber : 1, pageSize : 10, searchTerm: null });
    const [hasMultiplePages, setHasMultiplePages] = useState<boolean>((pagedResult?.pageCount || 0) > 1);
    const previousSearch = useRef<string | null | undefined>(queryParams?.searchTerm || '');

    useEffect(() => {

        const abortController = new AbortController();

        const fetchData = async () => {

            setLoading(true);

            try {
                const response = await fetch(`${apiBaseUrl}/categories?${(mountQueryParams(queryParams))}`,
                                             { signal: abortController.signal });
                const result = await response.json() as PagedResult<Category>;

                setPagedResult(result);
                setHasMultiplePages(result.pageCount > 1);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {

                if (error.name === 'AbortError') return;

                setError(error);

            } finally {

                setLoading(false);
                
            }
        }

        //If there was no search by term, fetch immediately
        if (previousSearch.current === queryParams.searchTerm) {
            fetchData();
            return;
        }

        //waits until the user stops typing then fetch data
        previousSearch.current = queryParams.searchTerm;
        const searchTID = setTimeout(() => {
            fetchData();
        }, 700);       

        return () => {
            clearTimeout(searchTID);
            abortController.abort();
        }
    }, [queryParams, deps]);

    const removeCategory = async (id: string) => {

        setLoading(true);
        
        try {
            const response = await fetch(
                `${apiBaseUrl}/categories/${id}`,
                { method : 'DELETE'});
    
            if (response.ok) setQueryParams({...queryParams, pageNumber: 1});
            else setError(new Error(response.statusText));
        } catch (error) {
            console.error('Error removing category:', error);
        } finally {
            setLoading(false);
        }
    }

    return {
        pagedResult,
        queryParams,
        setQueryParams,
        hasMultiplePages,
        loading,
        error,
        removeCategory
    };
}

export default useCategoryListing;