import { useEffect, useState } from 'react';
import './PerPersonTotalsReport.css';
import type { PerPersonTotalsReport } from '../models/PerPersonTotalsReport';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
}

const PerPersonTotalsReport = () => {

    const [reportData, setReportData] = useState<PerPersonTotalsReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {

        const abortController = new AbortController();

        const fetchReport = async () => {

            try {
                const response = await fetch(
                    `${apiBaseUrl}/reporting/per-person-totals`,
                    { signal: abortController.signal });
                
                const responseContent = await response.json() as PerPersonTotalsReport;

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
                            <th>Member</th>
                            <th>Income</th>
                            <th>Expense</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.perPersonReportLines.map((it,idx) => (
                            <tr key={idx}>
                                <td>{it.personName}</td>
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
export default PerPersonTotalsReport;