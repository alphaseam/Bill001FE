import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(LineElement, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

export default function SaleCharts({ lineData, barData, pieData, doughuntData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Line Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-center font-semibold mb-2">Sales Over Time</h2>
                <Line data={lineData} />
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-center font-semibold mb-2">Sales by Category</h2>
                <Bar data={barData} />
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-center font-semibold mb-2">Sales by Dealer</h2>
                <Pie data={pieData} />
            </div>
            {/* Doughunt Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-center font-semibold mb-2">Sales over time</h2>
                <Doughnut data={doughuntData} />
            </div>
        </div>
    );
}
