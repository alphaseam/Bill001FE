import React from 'react';
import {
    Line, Bar, Pie,
} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Filler,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Tooltip,
    Legend,
    Filler,
    Title
);

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F', '#FFBB28', '#FF4444'];

const Charts = ({ data }) => {
    const pieDataArray = Object.entries(data.pie).map(([name, value]) => ({ name, value }));

    const lineChartData = {
        labels: data.line.map(item => item.date),
        datasets: [
            {
                label: 'Sales Trend',
                data: data.line.map(item => item.amount),
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.2)',
                tension: 0.3,
                fill: true,
            }
        ],
    };

    const barChartData = {
        labels: data.bar.map(item => item.category),
        datasets: [
            {
                label: 'Category Sales',
                data: data.bar.map(item => item.amount),
                backgroundColor: '#82ca9d',
            }
        ],
    };

    const pieChartData = {
        labels: pieDataArray.map(d => d.name),
        datasets: [
            {
                label: 'Dealer Distribution',
                data: pieDataArray.map(d => d.value),
                backgroundColor: pieDataArray.map((_, i) => COLORS[i % COLORS.length]),
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index' },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="h-64 w-64">
                <h3 className="font-semibold mb-2">Sales Trend</h3>
                <Line data={lineChartData} options={options} />
            </div>

            <div className="h-64 w-64">
                <h3 className="font-semibold mb-2">Category Sales</h3>
                <Bar data={barChartData} options={options} />
            </div>

            <div className="h-64 w-64">
                <h3 className="font-semibold mb-2">Dealer Distribution</h3>
                <Pie data={pieChartData} options={options} />
            </div>
        </div>
    );
};

export default Charts;
