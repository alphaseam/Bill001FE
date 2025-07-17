import React, { useEffect, useState } from "react";
import { dashboardApi } from "../../services/api";
import SalesChart from "../../Components/SaleChart";
import SummaryBlocks from "../../Components/SummaryBlock";

const AnalyticsDashboard = () => {
    const [productwise, setProductwise] = useState([]);
    const [salesData, setSalesData] = useState([]); // NEW: for line chart
    const [filter, setFilter] = useState("weekly");
    const [summary, setSummary] = useState({ totalRevenue: 0, totalBills: 0 });

    const fetchData = async () => {
        try {
            const res1 = await dashboardApi.getBillStats(filter);
            const res2 = await dashboardApi.getBillStats("productwise");

            setSummary({
                totalRevenue: res1.data.totalRevenue,
                totalBills: res1.data.totalBills,
            });

            setSalesData(res1.data.details || []);         // Line chart data
            setProductwise(res2.data.details || []);       // Bar chart data
        } catch (err) {
            console.error("Failed to fetch analytics data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    return (
        <div className="p-6 space-y-8">
            <div>
                <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                    className="w-full border p-2 rounded"
                >
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                </select>
            </div>

            <SummaryBlocks data={summary} />

            <h1 className="text-2xl font-bold">📊 Sales Analytics</h1>
            <label className="block font-medium mb-1">Charts</label>

            <SalesChart type="line" data={salesData} title="Sales Trend" />
            <SalesChart type="bar" data={productwise} title="Product-wise Sales" />
        </div>
    );
};

export default AnalyticsDashboard;
