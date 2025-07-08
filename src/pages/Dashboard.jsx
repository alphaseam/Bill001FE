import React, { useEffect, useState } from 'react';

import SummaryBlock from '../Components/SummaryBlock';
import Filter from '../Components/Filter';
import SaleCharts from '../Components/SalesChart';
import DashboardLayout from '../Components/DashboardLayout';
import { dashboardApi } from '../services/api';

export default function Dashboard() {
    const [filters, setFilters] = useState({ date: '', dealer: '', category: '' });
    const [summary, setSummary] = useState({});
    const [lineData, setLineData] = useState({});
    const [barData, setBarData] = useState({});
    const [pieData, setPieData] = useState({});
    const [Doughnut, setDoughnut] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Uncomment the following code to fetch data from the API

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await dashboardApi.getsaleReport(filters);
            console.log(res);
            const { totalRevenue, totalTransactions, trends, byCategory, byDealer } = res.data;

            setSummary({ totalRevenue, totalTransactions });

            setLineData({
                labels: trends.map(t => t.date),
                datasets: [{
                    label: 'Sales',
                    data: trends.map(t => t.sales),
                    borderColor: '#4f46e5',
                    backgroundColor: '#c7d2fe',
                }],
            });

            setBarData({
                labels: byCategory.map(c => c.category),
                datasets: [{
                    label: 'Sales',
                    data: byCategory.map(c => c.sales),
                    backgroundColor: '#34d399',
                    broderWidth: 1,
                }],
            });

            setPieData({
                labels: byDealer.map(d => d.dealer),
                datasets: [{
                    label: 'Sales',
                    data: byDealer.map(d => d.sales),
                    backgroundColor: ['#f87171', '#60a5fa', '#fbbf24'],
                }],
            });

            setDoughnut({
                labels: date.map(d => d.date),
                datasets: [{
                    label: 'Sales',
                    data: date.map(d => d.sales),
                    backgroundColor: ['#f87171', '#60a5fa', '#fbbf24'],
                }],
            });

            setError(false);
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <DashboardLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 flex justify-center">Sales Dashboard</h1>

                <Filter filters={filters} setFilters={setFilters} />

                {loading && <p className="mt-4 text-center">Loading...</p>}
                {error && <p className="mt-4 text-center text-red-500">Failed to load data</p>}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 ">
                            <SummaryBlock title="Total Revenue" value={`₹${summary.totalRevenue}`} />
                            <SummaryBlock title="Total Transactions" value={summary.totalTransactions} />
                        </div>

                        <SaleCharts lineData={lineData} barData={barData} pieData={pieData} doughuntData={Doughnut} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
