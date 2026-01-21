import { useEffect, useState } from 'react';
import './TransactionsListing.css';
import Pagination from '../../../../common/components/pagination/Pagination';
import type { Transaction } from '../models/transaction'
import type { PagedResult } from '../../../../common/models/results/paged-result';
import type { QueryParams } from '../../../../common/models/searching/query-params';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultPageSize = 10;
type TransactionsListingProps = {
    onNewTransactionClick?: () => void;
};

const TransactionsListing = ({ onNewTransactionClick }: TransactionsListingProps) => {

    const [pagedResult, setPagedResult] = useState<PagedResult<Transaction> | null>(null);
    const [queryParams, setQueryParams] = useState<QueryParams>({ pageNumber: 1, pageSize: defaultPageSize });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const hasPagination = (pagedResult?.pageCount ?? 0) > 1;

    useEffect(() => {

        const abortController = new AbortController();

        const fetchTransactionsList = async () => {

            try {
                const response = await fetch(
                    `${apiBaseUrl}/people/transactions?pageNumber=${queryParams.pageNumber}&pageSize=${queryParams.pageSize}`,
                    { signal: abortController.signal });
                
                const pagedResult = await response.json() as PagedResult<Transaction>;

                setPagedResult(pagedResult);
            } catch (error: unknown) {
                if (error.name === 'AbortError') return;

                setError(error as Error);
                console.error('Error fetching Transactions list:', error);
            } finally {
                setLoading(false);
            }
        }

        const searchTID = setTimeout(() => {
            fetchTransactionsList();
        }, 700);

        return () => {
            clearTimeout(searchTID);
            abortController.abort();
        };
    }, [queryParams]);

    const handlePageChange = (pageNumber: number) => {
        setQueryParams({...queryParams, pageNumber});
    }

    if (loading) return <div>Loading. Please wait...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="transactions-listing-container">
            <button type="button" onClick={() => { onNewTransactionClick?.() }}>New transaction</button>
            {(pagedResult && pagedResult.itemCount > 0) &&
            <table className="transactions-listing">
                <thead>
                    <tr>
                        <th>Member</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedResult.items.map(it => (
                        <tr key={it.id}>
                            <td>{it.person.fullName}</td>
                            <td>{it.category.name}</td>
                            <td>{it.type}</td>
                            <td>${it.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>Count: {pagedResult.items.length}</td>
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
export default TransactionsListing;