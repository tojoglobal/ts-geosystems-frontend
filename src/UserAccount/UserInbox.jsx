import { AlertCircle } from "lucide-react";
import useDataQuery from "../utils/useDataQuery";
import { useSelector } from "react-redux";

const UserInbox = () => {
  const { user } = useSelector((state) => state.authUser);
  const { data=[], isLoading } = useDataQuery(
    ["categories", user?.email],
    `/api/order/inbox/${user?.email}`,
    !!user?.email
  );
  console.log(data);
  const fakeOrder = {
    id: "7188",
    date: "17th May 2025",
    amount: "£31,800.00",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Send A Message</h2>

        <form className="space-y-4">
          {/* Order Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Order:
            </label>
            <select
              className="w-full appearance-none border border-gray-300 rounded px-3 py-2 focus:outline-none"
              defaultValue={`Order #${fakeOrder.id} - Placed on ${fakeOrder.date} for ${fakeOrder.amount}`}
            >
              <option>{`Order #${fakeOrder.id} - Placed on ${fakeOrder.date} for ${fakeOrder.amount}`}</option>
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              rows={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
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
              className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-[#D81B60] transition-colors"
            >
              CLEAR
            </button>
          </div>
        </form>
      </div>

      {/* No Orders Message */}
      <div className="bg-white p-4 rounded border text-gray-600 flex items-start gap-2">
        <AlertCircle className="mt-[2px]" size={18} />
        <p className="text-[14px]">
          Once you place an order you'll have full access to send messages from
          this page.
        </p>
      </div>
    </div>
  );
};

export default UserInbox;
