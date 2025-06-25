// pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

import SummaryBlock from '../Components/SummaryBlock';

import api from '../services/api';
import Filter from '../Components/Filter';
import SaleCharts from '../Components/SalesChart';
import DashboardLayout from '../Components/DashboardLayout';

export default function Dashboard() {
    const [filters, setFilters] = useState({ date: 'Today', dealer: 'Dealer A', category: 'Electronics' });
    const [summary, setSummary] = useState({ totalSales: 2000, totalInvoices: 12 });
    const [lineData, setLineData] = useState({
        labels: ["2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05", "2025-06-06"],
        datasets: [{
            label: 'Sales',
            data: ["12000", "15000", "18000", "20000", "12000", "25000"],
            borderColor: ['#3A59D1'],
            backgroundColor: ['#c7d2fe'],
        }],
    });
    const [barData, setBarData] = useState({
        labels: ["Paneer", "shev", "kaju", "avakado", "custrod", "peanut"],
        datasets: [{
            label: 'Sales',
            data: [900, 600, 300, 200, 150, 200],
            backgroundColor: ['#34d399', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa', '#f472b6'],
            borderWidth: 1,
        }],
    });
    const [pieData, setPieData] = useState({
        labels: ["Dealer A", "Dealer B", "Dealer C", "Dealer D", "Dealer E"],
        datasets: [{
            label: 'Sales',
            data: [110000, 140000, 90000, 80000, 60000],
            backgroundColor: ['#443627',
                '#D98324',
                '#EFDCAB',
            ],
        }],
    });
    const [Doughnut, setDoughnut] = useState({
        labels: ["2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05", "2025-06-06"],
        datasets: [{
            label: 'Sales',
            data: [90000, 60000, 30000, 20000, 15000, 10000],
            backgroundColor: ['#0ABAB5',
                '#56DFCF',
                '#ADEED9',
                '#FFEDF3'],
        }],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Uncomment the following code to fetch data from the API

    /* const fetchData = async () => {
         setLoading(true);
         try {
             const res = await api.get('/sales', { params: filters });
             const { totalSales, totalInvoices, trends, byCategory, byDealer } = res.data;
 
             setSummary({ totalSales, totalInvoices });
 
             setLineData({
                 labels: data.trends.map(t => t.date),
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
 */
    return (
        <DashboardLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 flex justify-center">Sales Dashboard</h1>

                <Filter filters={filters} setFilters={setFilters} />

                {/* {loading && <p className="mt-4 text-center">Loading...</p>}
                {error && <p className="mt-4 text-center text-red-500">Failed to load data</p>} */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 ">
                            <SummaryBlock title="Total Sales" value={`₹${summary.totalSales}`} />
                            <SummaryBlock title="Total Invoices" value={summary.totalInvoices} />
                        </div>

                        <SaleCharts lineData={lineData} barData={barData} pieData={pieData} doughuntData={Doughnut} />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
