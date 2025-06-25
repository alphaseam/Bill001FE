function SummaryBlock({ title, value }) {
    return (
        <div className="bg-white p-4 rounded shadow-md text-center ">
            <h4 className="text-sm font-medium text-gray-600">{title}</h4>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}
export default SummaryBlock;