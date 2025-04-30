/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { toast } from "react-toastify";

const ClientMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublicUrl = useAxiospublic();

  const fetchMessages = async () => {
    try {
      const response = await axiosPublicUrl.get("/api/contact");
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axiosPublicUrl.delete(`/api/contact/${id}`);
        toast.success("Message deleted successfully");
        fetchMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
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
        <div className="text-sm text-gray-400">Sort By: Latest</div>
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
            {messages.map((message) => (
              <tr key={message.id} className="bg-slate-800 border-b border-slate-600">
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
                  <button 
                    onClick={() => handleDelete(message.id)}
                    className="text-red-400 hover:text-red-300"
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
