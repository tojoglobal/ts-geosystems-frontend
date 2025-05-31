import { useForm } from "react-hook-form";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useToastSwal from "../../Hooks/useToastSwal";
import { Mail, X } from "lucide-react";
import { Link } from "react-router-dom";

const AskAQuestion = ({ productName }) => {
  const axiosPublicUrl = useAxiospublic();
  const showToast = useToastSwal();
  const {
    register,
    handleSubmit,
    reset, // Use reset to clear form fields
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosPublicUrl.post("/api/product-questions", {
        ...data,
        product_name: productName,
      });
      showToast("success", "Question Sent!", "We'll get back to you soon.");
      // Close the drawer after successful submission
      document.getElementById("my-drawer-4").checked = false; // Uncheck the drawer checkbox
      reset(); // Reset form fields
    } catch (error) {
      showToast(
        "error",
        "Error",
        error.message || "Failed to send your question. Please try again."
      );
    }
  };

  // Function to close the drawer
  const closeDrawer = () => {
    document.getElementById("my-drawer-4").checked = false;
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
          <div className="flex justify-end mb-4">
            <button
              onClick={closeDrawer}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">
            Ask A Question
          </h2>
          <p className="text-sm mb-4 text-center w-[70%] mx-auto">
            Please fill in the form below to have your query answered by one of
            our product experts.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-normal text-gray-700 sr-only"
                >
                  First name *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="First name *"
                  className={`w-full p-3 focus:outline-none focus:border focus:border-gray-400 border border-gray-300 rounded-sm ${
                    errors.name ? "input-error" : ""
                  }`}
                  {...register("name", { required: "First name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-normal text-gray-700 sr-only"
                >
                  Last name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last name *"
                  className={`w-full p-3 focus:outline-none focus:border focus:border-gray-400 border border-gray-300 rounded-sm ${
                    errors.lastName ? "input-error" : ""
                  }`}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-normal text-gray-700 sr-only"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address *"
                  className={`w-full p-3 focus:outline-none focus:border focus:border-gray-400 border border-gray-300 rounded-sm ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-normal text-gray-700 sr-only"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Phone Number (Optional)"
                  className="w-full p-3 focus:outline-none focus:border focus:border-gray-400 border border-gray-300 rounded-sm"
                  {...register("phone")}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="question"
                className="block text-sm font-normal text-gray-700 sr-only"
              >
                Question *
              </label>
              <textarea
                id="question"
                placeholder="Question *"
                className={`textarea textarea-bordered h-24 w-full focus:outline-none focus:border focus:border-gray-400 border border-gray-300 rounded-sm ${
                  errors.question ? "textarea-error" : ""
                }`}
                {...register("question", { required: "Question is required" })}
              ></textarea>
              {errors.question && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.question.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-[#e62245] text-white py-3 px-4 rounded-[4px] hover:bg-red-700 transition duration-200"
            >
              Submit
            </button>
            <p className="text-[10px] text-gray-500 mt-4 text-center">
              This site is protected by reCAPTCHA and the Google&nbsp;
              <Link to="/policy" className="underline text-crimson-red mr-1">
                Privacy Policy
              </Link>
              and&nbsp;
              <Link to="/terms" className="underline text-crimson-red mr-1">
                Terms of Service
              </Link>
              apply.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskAQuestion;
