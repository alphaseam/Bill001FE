export default function Filter({ filters, setFilters }) {
    return (
        <div className="flex flex-wrap gap-4 justify-center">
            <select value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} className="border p-2 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 ">
                <option value="daily">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="yearly">This Year</option>
            </select>

            <select value={filters.dealer} onChange={e => setFilters({ ...filters, dealer: e.target.value })} className="border p-2 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100">
                <option value="All Dealer">All Dealers</option>
                <option value="Dealer A">Dealer A</option>
                <option value="Dealer B">Dealer B</option>
                <option value="Dealer C">Dealer C</option>
            </select>

            <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="border p-2 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100">
                <option value="All Categories">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Clothing</option>
                <option value="Groceries">Groceries</option>
                <option value="Furniture">Furniture</option>
                <option value="Toys">Toys</option>
            </select>
        </div>
    );
}
