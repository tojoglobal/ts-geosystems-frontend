import { useEffect } from "react";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import useDataQuery from "../utils/useDataQuery";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const UserInbox = () => {
  const axiosPublic = useAxiospublic();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.authUser);

  // Fetch user orders
  const {
    data = [],
    isLoading,
    isError,
  } = useDataQuery(
    ["userOrders", user?.email],
    `/api/order/inbox/${user?.email}`,
    !!user?.email
  );

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch,
  } = useForm();

  useEffect(() => {
    if (data.length > 0) {
      reset({
        selectedOrder: data[0]?.order_id || "",
        subject: "",
        message: "",
      });
    }
  }, [data, reset]);

  // Mutation for sending message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const res = await axiosPublic.post("/api/messages", messageData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        text: "Message sent successfully!",
        icon: "success",
        timer: 4000,
      });
      reset();
      queryClient.invalidateQueries(["userMessages"]);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to send message",
        icon: "error",
        timer: 4000,
      });
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.path, { message: err.msg });
        });
      }
    },
  });

  const onSubmit = (formData) => {
    const messageData = {
      order_id: formData.selectedOrder,
      subject: formData.subject,
      message: formData.message,
      user_email: user?.email,
    };
    sendMessageMutation.mutate(messageData);
  };

  const handleClear = () => {
    reset({
      selectedOrder: watch("selectedOrder"),
      subject: "",
      message: "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E63]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded border border-red-200 text-red-600 flex items-start gap-2">
        <AlertCircle className="mt-[2px]" size={18} />
        <p className="text-[14px]">
          Failed to load your orders. Please try again later.
        </p>
      </div>
    );
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
        <div className="mx-2 md:mx-0">
          <h2 className="text-[26px] font-light mb-6">Send A Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Order Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Order:
              </label>
              <select
                className="w-full text-sm !text-gray-500 appearance-none border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-crimson-red"
                {...register("selectedOrder", {
                  required: "Please select an order",
                })}
                disabled={isSubmitting}
              >
                {data.length > 0 &&
                  data.map((order) => (
                    <option key={order.order_id} value={order.order_id}>
                      Order #{order.order_id} - Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString()} for £
                      {parseFloat(order.total).toFixed(2)}
                    </option>
                  ))}
              </select>
              {errors.selectedOrder && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedOrder.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                className="w-full text-sm !text-gray-500 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-crimson-red"
                disabled={isSubmitting}
                {...register("subject", {
                  required: "You must enter a subject",
                  maxLength: {
                    value: 100,
                    message: "Subject must be less than 100 characters",
                  },
                })}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full text-sm !text-gray-500 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-crimson-red"
                disabled={isSubmitting}
                {...register("message", {
                  required: "You must enter a message",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#E91E63] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#D81B60] transition-colors flex items-center ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "SEND MESSAGE"
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="bg-gray-200 cursor-pointer text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
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
