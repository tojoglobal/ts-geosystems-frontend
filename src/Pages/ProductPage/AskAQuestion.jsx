import { useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useToastSwal from "../../Hooks/useToastSwal";
import { MessageCircle } from "lucide-react";

const AskAQuestion = ({ onClose, productName }) => {
  const axiosPublicUrl = useAxiospublic();
  const showToast = useToastSwal();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPublicUrl.post("/api/product-questions", {
        ...form,
        product_name: productName,
      });
      showToast("success", "Question Sent!", "We'll get back to you soon.");
      onClose();
    } catch (error) {
      showToast(
        "error",
        "Error",
        "Failed to send your question. Please try again."
      );
    }
  };

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="bg-crimson-red drawer-content -rotate-90">
        <label
          htmlFor="my-drawer-4"
          className="bg-crimson-red drawer-button btn btn-primary"
        >
          <span className="flex items-center gap-2">
            <MessageCircle /> Ask A Question
          </span>
        </label>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-white text-black min-h-full w-80 p-4">
          Sidebar Item 2
        </div>
      </div>
    </div>
  );
};

export default AskAQuestion;
