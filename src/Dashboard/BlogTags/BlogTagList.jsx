export default function BlogTagList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Blog Tag List</h3>
      <table className="min-w-full text-sm text-left border border-gray-600 mt-6">
        <thead>
          <tr className="text-left">
            <th className="p-3 border-b border-gray-600">Name</th>
            <th className="p-3 border-b border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((tag) => (
              <tr key={tag.id}>
                <td className="p-3 border-b border-gray-600">{tag.name}</td>
                <td className="p-3 border-b border-gray-600 space-x-2">
                  <button
                    onClick={() => onEdit(tag)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(tag.id)}
                    className="text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="2" className="p-3 text-center text-gray-500">
                No tags found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
