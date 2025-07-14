import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import Filter from '../Components/Filter'
import SummaryBlocks from '../Components/SummaryBlock';
import Charts from '../Components/Charts';
import DashboardLayout from '../Components/DashboardLayout';

const Dashboard = () => {
    const [filters, setFilters] = useState({ dateRange: null, dealer: '', category: '' });
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totalSales: 0, invoices: 0 });
    const [chartData, setChartData] = useState({ line: [], bar: [], pie: [] });
    const [noData, setNoData] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setNoData(false);
            const { dateRange } = filters;

            const from = dateRange?.[0];
            const to = dateRange?.[1];

            const fromDate = from?.toISOString().split('T')[0];
            const toDate = to?.toISOString().split('T')[0];

            const fromMonth = from?.getMonth() + 1; // January = 0, so add 1
            const fromYear = from?.getFullYear();

            const toMonth = to?.getMonth() + 1;
            const toYear = to?.getFullYear();

            const res = await dashboardApi.getDailySales(fromDate, toDate);

            if (res.data.length === 0) {
                setNoData(true);
                setChartData({ line: [], bar: [], pie: [] });
                return;
            }

            setSummary({
                totalSales: res.totalRevenue,
                invoices: res.totalTransactions,
            });

            setChartData({
                line: res.totalRevenue,
                bar: await dashboardApi.getProductWiseMonthly(fromMonth, fromYear).then(r => r.data),
                pie: res.data.reduce((acc, curr) => {
                    const dealer = curr.dealer || 'Unknown';
                    acc[dealer] = (acc[dealer] || 0) + curr.amount;
                    return acc;
                }, {}),
            });
        } catch (err) {
            console.error(err);
            setNoData(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filters.dateRange) fetchData();
    }, [filters]);

    return (
        <DashboardLayout>
            <div className="p-4">
                <Filter onChange={setFilters} />
                <SummaryBlocks data={summary} />
                {loading && <p>Loading...</p>}
                {noData && !loading && <p>No Data Found</p>}
                {!loading && !noData && <Charts data={chartData} />}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
