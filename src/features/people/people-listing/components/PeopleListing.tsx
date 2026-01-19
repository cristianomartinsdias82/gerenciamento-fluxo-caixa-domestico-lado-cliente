import { useEffect, useState } from 'react';
import './PeopleListing.css'
import type { Person } from '../models/person';
import type { PagedResult } from '../../../../common/results/paged-result';
import type { QueryParams } from '../../../../common/searching/query-params';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
type PeopleListingProps = {
    onNewPersonClick?: () => void;
};

const PeopleListing = ({onNewPersonClick}:PeopleListingProps) => {

    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [pagedResult, setPagedResult] = useState<PagedResult<Person> | null>(null);
    const [queryParams, setQueryParams] = useState<QueryParams | null>(null);

    useEffect(() => {

        const abortController = new AbortController();

        const fetchPeopleList = async () => {            

            try {
                const response = await fetch(`${apiBaseUrl}/people`, { signal: abortController.signal });
                const pagedResult = await response.json() as PagedResult<Person>;

                setPagedResult(pagedResult);
                setPeopleList(pagedResult.items);
                setQueryParams(pagedResult.queryParams);
            } catch (error: unknown) {
                if (error.name === 'AbortError') return;

                console.error('Error fetching people list:', error);
            }
        }

        fetchPeopleList();

        return () => abortController.abort();
    }, [queryParams, pagedResult]);

    const handleRemove = async (person: Person) => {
        if (!window.confirm(`Are you sure you want to remove ${person.fullName}? (All his/her income/expenses will be deleted as well.)`)) return;

        await removePerson(person.id);
    }

    const removePerson = async (id: string) => {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(
                `${apiBaseUrl}/people/${id}`,
                { method : 'DELETE'});

            if (response.ok) {
                setPeopleList(people => people.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error removing person:', error);
        }
    }

    return (
        <div className="people-listing-container">
            <button type="button" onClick={() => { onNewPersonClick?.() }}>New person</button>
            <table className="people-listing">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {peopleList.map(person => (
                        <tr key={person.id}>
                            <td>{person.fullName}</td>
                            <td>{person.age}</td>
                            <td><button type="button" onClick={() => handleRemove(person)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>Count: {peopleList.length}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
export default PeopleListing;