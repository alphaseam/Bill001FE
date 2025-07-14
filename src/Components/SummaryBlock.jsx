const SummaryBlocks = ({ data }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded shadow text-center">
                <p className="text-lg font-bold">₹{data.totalSales.toLocaleString()}</p>
                <p className="text-sm">Total Sales</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow text-center">
                <p className="text-lg font-bold">{data.invoices}</p>
                <p className="text-sm">Total Invoices</p>
            </div>
        </div>
    );
};

export default SummaryBlocks;
