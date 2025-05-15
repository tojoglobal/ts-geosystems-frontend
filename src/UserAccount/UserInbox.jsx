import { AlertCircle } from "lucide-react";
const UserInbox = () => {
  return (
    <div>
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
