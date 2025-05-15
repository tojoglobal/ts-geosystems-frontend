export default function PromoCodeList({ data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full text-sm text-left border border-gray-600 mt-6">
        <thead>
          <tr>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Title</th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Code</th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Times</th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Discount</th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Type</th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Status</th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((promo) => (
            <tr key={promo.id} className="border-t border-gray-600">
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.title}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.code_name}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.no_of_times}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.discount}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.type}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.status ? "Active" : "Inactive"}
              </td>
              <td className="px-2 sm:px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(promo)}
                    className="bg-blue-600 cursor-pointer px-3 py-1.5 rounded min-w-[60px] text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(promo.id)}
                    className="bg-red-700 cursor-pointer text-white px-3 py-1.5 rounded min-w-[60px] text-center"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
