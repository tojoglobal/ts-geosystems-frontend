export default function AuthorList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Author List</h3>
      <table className="min-w-full text-sm text-left border border-gray-600 mt-6">
        <thead>
          <tr className="text-left">
            <th className="p-3 border-b border-gray-600">Name</th>
            <th className="p-3 border-b border-gray-600">Status</th>
            <th className="p-3 border-b border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((author) => (
              <tr key={author.id}>
                <td className="p-3 border-b border-gray-600">{author.name}</td>
                <td className="p-3 border-b border-gray-600">
                  {author.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-3 border-b border-gray-600 space-x-3">
                  <button
                    onClick={() => onEdit(author)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(author.id)}
                    className="text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                No authors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
