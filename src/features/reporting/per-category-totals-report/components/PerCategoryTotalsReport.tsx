import { useEffect, useState } from 'react';
import './PerCategoryTotalsReport.css';
import type { PerCategoryTotalsReport } from '../models/PerCategoryTotalsReport';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
}

const PerCategoryTotalsReport = () => {

    const [reportData, setReportData] = useState<PerCategoryTotalsReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {

        const abortController = new AbortController();

        const fetchReport = async () => {

            try {
                const response = await fetch(
                    `${apiBaseUrl}/reporting/per-category-totals`,
                    { signal: abortController.signal });
                
                const responseContent = await response.json() as PerCategoryTotalsReport;

                setReportData(responseContent);
            } catch (error: unknown) {
                if (error.name === 'AbortError') return;

                setError(error as Error);
                console.error('Error fetching the report:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchReport();

        return () => abortController.abort()
    }, []);

    if (loading) return <div>Loading. Please wait...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="report-container">
            {reportData &&
            <>
                <h2>Per Person Totals</h2>
                <table className="report-listing">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Income</th>
                            <th>Expense</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.perCategoryReportLines.map((it,idx) => (
                            <tr key={idx}>
                                <td>{it.categoryName}</td>
                                <td>{formatCurrency(it.incomeTotal)}</td>
                                <td>{formatCurrency(it.expensesTotal)}</td>
                                <td>{formatCurrency(it.netTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <p>Income total: {formatCurrency(reportData.incomeTotal)}</p>
                    <p>Expense total: {formatCurrency(reportData.expensesTotal)}</p>
                    <p>Net total: <span className={`net-total-${reportData.incomeTotal === 0 ? 'zero' : reportData.incomeTotal > 0 ? 'positive' : 'negative'}`}>{formatCurrency(reportData.netTotal)}</span></p>
                </div>
            </>}
        </div>
    );
}
export default PerCategoryTotalsReport;