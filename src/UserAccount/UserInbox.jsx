import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import useDataQuery from "../utils/useDataQuery";

const UserInbox = () => {
  const { user } = useSelector((state) => state.authUser);
  const { data = [], isLoading } = useDataQuery(
    ["categories", user?.email],
    `/api/order/inbox/${user?.email}`,
    !!user?.email
  );

  const [selectedOrder, setSelectedOrder] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission
  };

  const handleClear = () => {
    setSubject("");
    setMessage("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <div className="bg-white p-4 rounded border text-gray-600 flex items-start gap-2">
          <AlertCircle className="mt-[2px]" size={18} />
          <p className="text-[14px]">
            Once you place an order you'll have full access to send messages
            from this page.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-[26px] font-light mb-6">Send A Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Order Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Order:
              </label>
              <select
                className="w-full appearance-none border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-crimson-red"
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
              >
                {data.map((order) => (
                  <option key={order.order_id} value={order.order_id}>
                    Order #{order.order_id} - Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString()} for £
                    {parseFloat(order.total).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-crimson-red"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-crimson-red"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-[#D81B60] transition-colors"
              >
                SEND MESSAGE
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-[#D81B60] transition-colors"
              >
                CLEAR
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserInbox;
