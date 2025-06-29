import { Eye, Trash } from "lucide-react";
import useDataQuery from "../../utils/useDataQuery";
import Swal from "sweetalert2";
import Loader from "../../utils/Loader";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ClientMessages = () => {
  const axiosPublic = useAxiospublic();
  const {
    data = { messages: [] },
    isLoading,
    refetch,
  } = useDataQuery(["contactMessages"], "/api/contact-messages");

  const handleDelete = async (id) => {
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
        Swal.fire({
          title: "Deleted!",
          text: "The message has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete message. Please refresh and try again or contact admin if the problem persists.",
          icon: "error",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      }
    }
  };

  const showFullMessage = (message) => {
    Swal.fire({
      title: `Message from ${message.first_name} ${message.last_name}`,
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Email:</strong> ${message.email}</p>
          <p class="mb-2"><strong>Phone:</strong> ${message.phone || "N/A"}</p>
          <p class="mb-2"><strong>Date:</strong> ${new Date(
            message.created_at
          ).toLocaleString()}</p>
          <hr class="my-3 border-slate-600">
          <div class="max-h-96 overflow-y-auto">
            <p class="whitespace-pre-wrap">${message.message}</p>
          </div>
        </div>
      `,
      width: "800px",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      showCloseButton: true,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Client Messages (From Contact Us)
        </h2>
        <div className="text-sm text-gray-400">
          Total Messages: {data.messages.length}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-3 md:px-4 py-2">Name</th>
              <th className="px-3 md:px-4 py-2">Email</th>
              <th className="px-3 md:px-4 py-2">Phone</th>
              <th className="px-3 md:px-4 py-2">Message Preview</th>
              <th className="px-3 md:px-4 py-2">Date</th>
              <th className="px-3 md:px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.messages.map((message) => (
              <tr
                key={message.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-3 md:px-4 py-2 capitalize">{`${message.first_name} ${message.last_name}`}</td>
                <td className="px-3 md:px-4 py-2">{message.email}</td>
                <td className="px-3 md:px-4 py-2">{message.phone || "N/A"}</td>
                <td
                  className="px-3 md:px-4 py-2 cursor-pointer"
                  onClick={() => showFullMessage(message)}
                >
                  <div className="max-w-xs truncate hover:text-clip hover:text-white">
                    {message.message.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-3 md:px-4 py-2">
                  {new Date(message.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 md:px-4 py-2 flex gap-2">
                  <button
                    onClick={() => showFullMessage(message)}
                    className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                    title="Delete"
                  >
                    <Trash size={16} />
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
