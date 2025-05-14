import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";

const ClientMessages = () => {
  const axiosPublic = useAxiospublic();
  const {
    data = { messages: [] },
    isLoading,
    refetch,
  } = useDataQuery(["contactMessages"], "/api/contact-messages");

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Delete Message?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });
    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/api/contact-messages/${id}`);
        refetch();

        // Show success notification
        Swal.fire({
          title: "Deleted!",
          text: "The message has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      } catch (error) {
        console.error("Error deleting message:", error);

        // Show error notification
        Swal.fire({
          title: "Error!",
          text: "Failed to delete message",
          icon: "error",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      }
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
          Total Messages: {data?.messages?.length || 0}
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
                className="bg-slate-800 border-b border-slate-600 hover:bg-slate-700"
              >
                <td className="px-4 py-2">{`${message.first_name} ${message.last_name}`}</td>
                <td className="px-4 py-2">{message.email}</td>
                <td className="px-4 py-2">{message.phone}</td>
                <td className="px-4 py-2">
                  <div className="max-w-xs truncate hover:text-clip">
                    {message.message}
                  </div>
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
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete message"
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
