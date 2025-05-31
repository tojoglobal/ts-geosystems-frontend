// AskAQuestion.jsx
import { useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useToastSwal from "../../Hooks/useToastSwal";
import { Mail, MessageCircle, Send } from "lucide-react";

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
      // Close the drawer after successful submission
      document.getElementById("my-drawer-4").checked = false; // Uncheck the drawer checkbox
      // Reset form (optional)
      setForm({ name: "", email: "", phone: "", question: "" });
    } catch (error) {
      showToast(
        "error",
        "Error",
        "Failed to send your question. Please try again."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content -rotate-90 fixed top-1/2 -right-10 transform -translate-y-1/2">
        <label
          htmlFor="my-drawer-4"
          className="cursor-pointer bg-[#e62245] text-white py-[14px] px-3 shadow-2xl rounded-[4px] flex items-center gap-2 transform origin-top-left"
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Mail size={18} /> Ask A Question
          </span>
        </label>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-white text-black min-h-full w-[500px] p-4">
          here form
        </div>
      </div>
    </div>
  );
};

export default AskAQuestion;
