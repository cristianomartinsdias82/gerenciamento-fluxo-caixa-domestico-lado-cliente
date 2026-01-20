import { useEffect, useState, type ChangeEvent } from 'react';
import './PeopleListing.css';
import Pagination from '../../../../common/components/pagination/Pagination';
import type { Person } from '../models/person';
import type { PagedResult } from '../../../../common/models/results/paged-result';
import type { QueryParams } from '../../../../common/models/searching/query-params';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultPageSize = 10;
type PeopleListingProps = {
    onNewPersonClick?: () => void;
};

const PeopleListing = ({ onNewPersonClick }: PeopleListingProps) => {

    const [pagedResult, setPagedResult] = useState<PagedResult<Person> | null>(null);
    const [queryParams, setQueryParams] = useState<QueryParams>({ pageNumber: 1, pageSize: defaultPageSize });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchInput, setSearchInput] = useState<string>('');
    const hasPagination = (pagedResult?.pageCount ?? 0) > 1;

    useEffect(() => {

        const abortController = new AbortController();

        const fetchPeopleList = async () => {

            try {
                const response = await fetch(
                    `${apiBaseUrl}/people?pageNumber=${queryParams.pageNumber}&pageSize=${queryParams.pageSize}&searchTerm=${encodeURIComponent(searchInput)}`,
                    { signal: abortController.signal });
                
                const pagedResult = await response.json() as PagedResult<Person>;

                setPagedResult(pagedResult);
            } catch (error: unknown) {
                if (error.name === 'AbortError') return;

                setError(error as Error);
                console.error('Error fetching people list:', error);
            } finally {
                setLoading(false);
            }
        }

        const searchTID = setTimeout(() => {
            fetchPeopleList();
        }, 700);

        return () => {
            clearTimeout(searchTID);
            abortController.abort();
        };
    }, [queryParams, searchInput]);

    const handleRemove = async (person: Person) => {
        if (!window.confirm(`Are you sure you want to remove '${person.fullName}'? (All his/her income and expenses will be deleted as well!)`)) return;

        await removePerson(person.id);
    }

    const removePerson = async (id: string) => {
        try {
                const response = await fetch(
                `${apiBaseUrl}/people/${id}`,
                { method : 'DELETE'});

            if (response.ok) setQueryParams({...queryParams, pageNumber: 1});
            else setError(new Error(response.statusText));
        } catch (error) {
            console.error('Error removing person:', error);
        }
    }

    const handlePageChange = (pageNumber: number) => {
        setQueryParams({...queryParams, pageNumber});
    }

    const handleSearchChange = (e: ChangeEvent) => {
        const val = (e.target as HTMLInputElement).value;
        setSearchInput(val);
        setQueryParams({...queryParams, searchTerm: val});
    }

    if (loading) return <div>Loading. Please wait...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="people-listing-container">
            <button type="button" onClick={() => { onNewPersonClick?.() }}>New person</button>
            <input type="text" placeholder="Search by name" value={searchInput} onChange={handleSearchChange} />
            {(pagedResult && pagedResult.itemCount > 0) &&
            <table className="people-listing">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedResult.items.map(it => (
                        <tr key={it.id}>
                            <td>{it.fullName}</td>
                            <td>{it.age}</td>
                            <td><button type="button" onClick={() => handleRemove(it)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>Count: {pagedResult.items.length}</td>
                    </tr>
                </tfoot>
            </table>}
            {hasPagination &&
             <Pagination paginationParams={{
                         pageNumber: pagedResult!.queryParams.pageNumber,
                         pageSize: pagedResult!.queryParams.pageSize,
                         totalItems: pagedResult!.itemCount}}
                         onPageChange={handlePageChange} />}
        </div>
    );
}
export default PeopleListing;