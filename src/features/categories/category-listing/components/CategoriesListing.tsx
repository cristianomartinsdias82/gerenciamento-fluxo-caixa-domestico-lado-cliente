import { useEffect, useState, type ChangeEvent } from 'react';
import './CategoriesListing.css';
import Pagination from '../../../../common/components/pagination/Pagination';
import type { Category } from '../models/category';
import type { PagedResult } from '../../../../common/models/results/paged-result';
import type { QueryParams } from '../../../../common/models/searching/query-params';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultPageSize = 10;
type CategoriesListingProps = {
    onNewCategoryClick?: () => void;
};

const CategoriesListing = ({ onNewCategoryClick }: CategoriesListingProps) => {

    const [pagedResult, setPagedResult] = useState<PagedResult<Category> | null>(null);
    const [queryParams, setQueryParams] = useState<QueryParams>({ pageNumber: 1, pageSize: defaultPageSize });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchInput, setSearchInput] = useState<string>('');
    const hasPagination = (pagedResult?.pageCount ?? 0) > 1;

    useEffect(() => {

        const abortController = new AbortController();

        const fetchCategoriesList = async () => {

            try {
                const response = await fetch(
                    `${apiBaseUrl}/categories?pageNumber=${queryParams.pageNumber}&pageSize=${queryParams.pageSize}&searchTerm=${encodeURIComponent(searchInput)}`,
                    { signal: abortController.signal });
                
                const pagedResult = await response.json() as PagedResult<Category>;

                setPagedResult(pagedResult);
            } catch (error: unknown) {
                if (error.name === 'AbortError') return;

                setError(error as Error);
                console.error('Error fetching Categories list:', error);
            } finally {
                setLoading(false);
            }
        }

        const searchTID = setTimeout(() => {
            fetchCategoriesList();
        }, 700);

        return () => {
            clearTimeout(searchTID);
            abortController.abort();
        };
    }, [queryParams, searchInput]);

    const handleRemove = async (category: Category) => {
        if (!window.confirm(`Are you sure you want to remove '${category.name}'?`)) return;

        await removeCategory(category.id);
    }

    const removeCategory = async (id: string) => {
        try {
                const response = await fetch(
                `${apiBaseUrl}/categories/${id}`,
                { method : 'DELETE'});

            if (response.ok) setQueryParams({...queryParams, pageNumber: 1});
            else setError(new Error(response.statusText));
        } catch (error) {
            console.error('Error removing category:', error);
        }
    }

    const handlePageChange = (pageNumber: number) => {
        setLoading(true);
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
        <div className="categories-listing-container">
            <button type="button" onClick={() => { onNewCategoryClick?.() }}>New category</button>
            <input type="text" placeholder="Search by name" value={searchInput} onChange={handleSearchChange} />
            {(pagedResult && pagedResult.itemCount > 0) &&
            <table className="categories-listing">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Purpose</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedResult.items.map(it => (
                        <tr key={it.id}>
                            <td>{it.name}</td>
                            <td>{it.purpose.text}</td>
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
export default CategoriesListing;