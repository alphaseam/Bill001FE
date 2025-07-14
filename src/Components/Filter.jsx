import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Filters = ({ onChange }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [dealer, setDealer] = useState('');
    const [category, setCategory] = useState('');
    const [start, end] = dateRange;

    const applyFilters = () => {
        onChange({ dateRange, dealer, category });
    };

    return (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block font-medium mb-1">Date Range</label>
                <DatePicker
                    selectsRange
                    startDate={start}
                    endDate={end}
                    onChange={(update) => setDateRange(update)}
                    isClearable
                    className="w-full border p-2 rounded"
                />
            </div>
            <div>
                <label className="block font-medium mb-1">Dealer</label>
                <select onChange={(e) => setDealer(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">All</option>
                    <option value="DealerA">Dealer A</option>
                    <option value="DealerB">Dealer B</option>
                </select>
            </div>
            <div>
                <label className="block font-medium mb-1">Category</label>
                <select onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">All</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                </select>
            </div>
            <button
                onClick={applyFilters}
                className="col-span-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default Filters;
