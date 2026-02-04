import { /*useEffect, useState,*/ useState, type ChangeEvent } from 'react';
import './CategoriesListing.css';
import Pagination from '../../../../common/components/pagination/Pagination';
import type { Category } from '../models/category';
import useCategoryListing from '../hooks/useCategoryListing';
//import type { PagedResult } from '../../../../common/models/results/paged-result';
//import type { QueryParams } from '../../../../common/models/searching/query-params';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//const defaultPageSize = 10;
type CategoriesListingProps = {
    onNewCategoryClick?: () => void;
};

//https://tigeroakes.com/posts/react-focus-on-render/
const autoFocus = (element: HTMLInputElement) => element?.focus();

const CategoriesListing = ({ onNewCategoryClick }: CategoriesListingProps) => {

    const [searchInput, setSearchInput] = useState<string>('');
    const [removeError, setRemoveError] = useState(null);

    const {
        queryParams,
        setQueryParams,
        pagedResult,
        hasMultiplePages,
        loading,
        error
    } = useCategoryListing();

    const noItemsMessage = searchInput.length > 0 ? "The search returned no results." : "No people registered just yet!";

    const handleRemove = async (category: Category) => {
        if (!window.confirm(`Are you sure you want to remove '${category.name}'?`)) return;

        await removeCategory(category.id);
    }

    //TODO: move the implementation to useCategoriesListing hook
    const removeCategory = async (id: string) => {
        try {
            const response = await fetch(
                `${apiBaseUrl}/categories/${id}`,
                { method : 'DELETE'});

            if (response.ok) setQueryParams({...queryParams, pageNumber: 1});
            else setRemoveError(new Error(response.statusText));
        } catch (error) {
            console.error('Error removing category:', error);
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
    if (removeError) return <div>Error: {removeError.message}</div>;

    return (
        <div className="categories-listing-container">
            <button type="button" onClick={() => { onNewCategoryClick?.() }}>New category</button>
            <input type="text" ref={autoFocus} placeholder="Search by name" value={searchInput} onChange={handleSearchChange} />
            {!pagedResult || pagedResult.itemCount === 0 && <p>{noItemsMessage}</p>}
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
            {hasMultiplePages &&
             <Pagination paginationParams={{
                         pageNumber: pagedResult!.queryParams.pageNumber,
                         pageSize: pagedResult!.queryParams.pageSize,
                         totalItems: pagedResult!.itemCount}}
                         onPageChange={handlePageChange} />}
        </div>
    );
}
export default CategoriesListing;