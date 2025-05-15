import { AlertCircle } from "lucide-react";

const UserOrders = () => {
  return (
    <div>
      <div className="bg-white p-4 rounded border text-gray-600 flex items-start gap-2">
        <AlertCircle className="mt-[2px]" size={18} />
        <p className="text-[14px]">
          You haven't placed any orders with us. When you do, their status will
          appear on this page.
        </p>
      </div>
    </div>
  );
};

export default UserOrders;
