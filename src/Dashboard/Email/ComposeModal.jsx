import { useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { X } from "lucide-react";
import Swal from "sweetalert2";

const ComposeModal = ({ onClose, onSent, initialData }) => {
  const axiosPublicUrl = useAxiospublic();
  const [form, setForm] = useState(
    initialData || { recipient: "", subject: "", body: "" }
  );

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      await axiosPublicUrl.post("/api/emails/send", form);

      if (onSent) onSent();

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Your message has been successfully delivered.",
        confirmButtonColor: "#3B82F6",
        background: "#18181b",
        color: "#fff",
        timer: 4000,
      });

      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong while sending the email.",
        confirmButtonColor: "#EF4444",
        background: "#18181b",
        color: "#fff",
        timer: 4000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="text-gray-100 w-full max-w-2xl rounded-2xl shadow-lg p-6 md:p-8 relative border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-6">
          Compose Email
        </h2>

        {/* Form */}
        <form onSubmit={handleSend} className="space-y-5">
          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              To
            </label>
            <input
              type="email"
              placeholder="Recipient email"
              className="w-full rounded-lg border border-gray-700 bg-neutral-800 text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-700 focus:outline-none transition"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject
            </label>
            <input
              placeholder="Email subject"
              className="w-full rounded-lg border border-gray-700 bg-neutral-800 text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-700 focus:outline-none transition"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              placeholder="Type your message here..."
              className="w-full rounded-lg border border-gray-700 bg-neutral-800 text-gray-100 px-4 py-2 resize-none focus:ring-2 focus:ring-blue-700 focus:outline-none transition"
              rows={6}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-800 text-gray-300 px-5 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;
