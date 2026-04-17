export default function Dashboard({ data }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="bg-white p-4 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Total</p>
        <p className="text-xl font-bold">{data.total || 0}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Positive</p>
        <p className="text-xl font-bold text-green-600">{data.positive || 0}</p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Neutral</p>
        <p className="text-xl font-bold text-yellow-600">{data.neutral || 0}</p>
      </div>

      <div className="bg-red-50 p-4 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Negative</p>
        <p className="text-xl font-bold text-red-600">{data.negative || 0}</p>
      </div>
    </div>
  );
}
