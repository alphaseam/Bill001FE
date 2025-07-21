import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesChart = ({ type = "line", data = [], title = "Chart" }) => {
    // Handle empty data
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-4 rounded shadow text-center text-gray-500 w-full">
                No data available to display "{title}"
            </div>
        );
    }

    // Create labels and values
    const labels = data.map((d) => d.label);
    const values = data.map((d) => d.count);

    const chartData = {
        labels,
        datasets: [
            {
                label: title,
                data: values,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                fill: type === "line",
                tension: 0.4,
                pointBackgroundColor: "white",
                pointBorderColor: "rgba(54, 162, 235, 1)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 18,
                },
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => Number(value).toLocaleString(),
                    maxTicksLimit: 6,
                },
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow w-full h-[300px] sm:h-[400px]">
            {type === "line" && (
                <Line data={chartData} options={chartOptions} />
            )}
            {type === "bar" && (
                <Bar data={chartData} options={chartOptions} />
            )}
        </div>
    );
};

export default SalesChart;
