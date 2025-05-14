import { toast } from "react-toastify";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ClientMessages = () => {
  const axiosPublic = useAxiospublic();
  const {
    data={},
    isLoading,
    refetch,
  } = useDataQuery(["contactMessages"], "/api/contact-messages");

  const handleDelete = async (id) => {
    try {
      await axiosPublic.delete(`/api/contact-messages/${id}`);
      toast.success("Message deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 text-white rounded-lg p-4 my-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Client Messages</h2>
        <div className="text-sm text-gray-400">
          Total Messages: {data?.messages.length}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.messages.map((message) => (
              <tr
                key={message.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-4 py-2">{`${message.first_name} ${message.last_name}`}</td>
                <td className="px-4 py-2">{message.email}</td>
                <td className="px-4 py-2">{message.phone}</td>
                <td className="px-4 py-2">
                  <div className="max-w-xs truncate">{message.message}</div>
                </td>
                <td className="px-4 py-2">
                  {new Date(message.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      message.status === "unread"
                        ? "bg-yellow-500 text-yellow-900"
                        : "bg-green-500 text-green-900"
                    }`}
                  >
                    {message.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-400 cursor-pointer hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientMessages;
