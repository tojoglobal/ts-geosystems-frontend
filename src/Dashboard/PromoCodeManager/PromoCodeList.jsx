export default function PromoCodeList({ data, onEdit, onDelete }) {
  return (
    <table className="min-w-full text-sm text-left border border-gray-600 mt-6">
      <thead>
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Code</th>
          <th className="px-4 py-2">Times</th>
          <th className="px-4 py-2">Discount</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((promo) => (
          <tr key={promo.id} className="border-t border-gray-600">
            <td className="px-4 py-2">{promo.title}</td>
            <td className="px-4 py-2">{promo.code_name}</td>
            <td className="px-4 py-2">{promo.no_of_times}</td>
            <td className="px-4 py-2">{promo.discount}</td>
            <td className="px-4 py-2">{promo.type}</td>
            <td className="px-4 py-2">
              {promo.status ? "Active" : "Inactive"}
            </td>
            <td className="px-4 py-2 space-x-2">
              <button
                onClick={() => onEdit(promo)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(promo.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
