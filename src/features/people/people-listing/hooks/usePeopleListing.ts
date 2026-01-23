import { useEffect, useRef, useState } from 'react';
import type { PagedResult } from '../../../../common/models/results/paged-result';
import type { Person } from '../models/person';
import type { QueryParams } from '../../../../common/models/searching/query-params';

export type usePeopleListDeps = {};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const mountQueryParams = (query: QueryParams) => `pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&searchTerm=${encodeURIComponent(query.searchTerm ?? '')}`;

const usePeopleListing = (deps?: usePeopleListDeps, onPostSearch?: () => void) => {

    const [pagedResult, setPagedResult] = useState<PagedResult<Person> | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [queryParams, setQueryParams] = useState<QueryParams>({ pageNumber : 1, pageSize : 10, searchTerm: null });
    const [hasMultiplePages, setHasMultiplePages] = useState<boolean>((pagedResult?.pageCount || 0) > 1);
    const previousSearch = useRef<string | null | undefined>(queryParams?.searchTerm || '');

    useEffect(() => {

        const abortController = new AbortController();

        const fetchData = async () => {
            
            setLoading(true);

            try {

                const response = await fetch(`${apiBaseUrl}/people?${(mountQueryParams(queryParams))}`);
                const result = await response.json() as PagedResult<Person>;
                setPagedResult(result);
                setHasMultiplePages(result.pageCount > 1);

            } catch (error: unknown) {
                
                if (error.name === 'AbortError') return;

                setError(error);

            } finally {

                setLoading(false);
                onPostSearch?.();

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
    }, [queryParams, deps?.onPostSearch]);

    const removePerson = async (id: string) => {

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/people/${id}`,
                { method : 'DELETE'});

            if (response.ok) setQueryParams({...queryParams, pageNumber: 1});
            else setError(new Error(response.statusText));
        } catch (error) {
            console.error('Error removing person:', error);
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
        removePerson
    };
}

export default usePeopleListing;
