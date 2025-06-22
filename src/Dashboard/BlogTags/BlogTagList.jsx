import { MdEdit, MdDelete } from "react-icons/md";

export default function BlogTagList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3">
        Blog Tag List
      </h3>
      <table className="min-w-full text-sm text-left border border-gray-800 bg-gray-900/95 rounded-xl shadow-xl mt-6 text-white">
        <thead>
          <tr>
            <th className="p-3 border-b border-gray-700 font-semibold">Name</th>
            <th className="p-3 border-b border-gray-700 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-800/70 transition">
                <td className="p-3 border-b border-gray-800">{tag.name}</td>
                <td className="p-3 border-b border-gray-800">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(tag)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded cursor-pointer transition"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(tag.id)}
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
                colSpan="2"
                className="p-3 text-center text-gray-400 bg-gray-900"
              >
                No tags found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
