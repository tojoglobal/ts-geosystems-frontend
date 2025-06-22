import { MdEdit, MdDelete } from "react-icons/md";

export default function BlogTypeList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 ">Blog Type List</h3>
      <table className="min-w-full text-sm text-left border border-gray-800 bg-gray-900/95 rounded-xl shadow-xl mt-6 text-white">
        <thead>
          <tr>
            <th className="p-3 border-b border-gray-700 font-semibold">Name</th>
            <th className="p-3 border-b border-gray-700 font-semibold">
              Status
            </th>
            <th className="p-3 border-b border-gray-700 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((type) => (
              <tr key={type.id} className="hover:bg-gray-800/70 transition">
                <td className="p-3 border-b border-gray-800">{type.name}</td>
                <td className="p-3 border-b border-gray-800">
                  {type.status === 1 ? (
                    <span className="text-green-400 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400 font-semibold">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-3 border-b border-gray-800">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(type)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded cursor-pointer transition"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(type.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer transition"
                      title="Delete"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="p-3 text-center text-gray-400 bg-gray-900"
              >
                No blog types found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
