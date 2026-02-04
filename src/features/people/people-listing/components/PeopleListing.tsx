import { useState, type ChangeEvent } from 'react';
import './PeopleListing.css';
import Pagination from '../../../../common/components/pagination/Pagination';
import type { Person } from '../models/person';
import usePeopleListing from '../hooks/usePeopleListing';

type PeopleListingProps = {
    onNewPersonClick?: () => void;
};

//https://tigeroakes.com/posts/react-focus-on-render/
const autoFocus = (element: HTMLInputElement) => element?.focus();

const PeopleListing = ({ onNewPersonClick }: PeopleListingProps) => {

    const [searchInput, setSearchInput] = useState<string>('');
    const {
        queryParams,
        setQueryParams,
        pagedResult,
        hasMultiplePages,
        loading,
        error,
        removePerson
    } = usePeopleListing();

    const noItemsMessage = searchInput.length > 0 ? "The search returned no results." : "No people registered just yet!";

    const handleRemove = async (person: Person) => {
        if (!window.confirm(`Are you sure you want to remove '${person.fullName}'? (All his/her income and expenses will be deleted as well!)`)) return;

        await removePerson(person.id);
    }

    const handlePageChange = (pageNumber: number) => {
        setQueryParams({...queryParams, pageNumber});
    }

    const handleSearchChange = (e: ChangeEvent) => {
        const val = (e.target as HTMLInputElement).value;
        setSearchInput(val);

        setQueryParams({
            ...queryParams,
            searchTerm: val,
            pageNumber: 1
        });
    }

    if (loading) return <div>Loading. Please wait...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="people-listing-container">
            <button type="button" onClick={() => { onNewPersonClick?.() }}>New person</button>
            <input type="text" ref={autoFocus} placeholder="Search by name" value={searchInput} onChange={handleSearchChange} />
            {!pagedResult || pagedResult.itemCount === 0 && <p>{noItemsMessage}</p>}
            {(pagedResult && pagedResult.itemCount > 0) &&
            <>                
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
                </table>
            </>}
            {hasMultiplePages &&
             <Pagination paginationParams={{
                         pageNumber: pagedResult!.queryParams.pageNumber,
                         pageSize: pagedResult!.queryParams.pageSize,
                         totalItems: pagedResult!.itemCount}}
                         onPageChange={handlePageChange} />}
        </div>
    );
}
export default PeopleListing;
