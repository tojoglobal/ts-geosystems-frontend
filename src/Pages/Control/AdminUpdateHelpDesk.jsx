import { useForm } from "react-hook-form";
import Button from "../../Dashboard/Button/Button";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Loader from "../../utils/Loader";

const AdminUpdateHelpDesk = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data: info, isLoading } = useQuery({
    queryKey: ["helpdeskInfo"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/helpdesk-info");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => axiosPublicUrl.put("/api/helpdesk-info", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["helpdeskInfo"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Updated!",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      helpline_number: "",
      whatsapp: "",
      email: "",
      contact_btn_label: "",
      contact_btn_link: "",
      tooltip_text: "",
      top_menu_phone: "",
      helpline_label: "",
      whatsapp_label: "",
      email_label: "",
    },
  });

  useEffect(() => {
    if (info) {
      reset({
        title: info.title || "",
        helpline_number: info.helpline_number || "",
        whatsapp: info.whatsapp || "",
        email: info.email || "",
        contact_btn_label: info.contact_btn_label || "",
        contact_btn_link: info.contact_btn_link || "",
        tooltip_text: info.tooltip_text || "",
        top_menu_phone: info.top_menu_phone || "",
        helpline_label: info.helpline_label || "Helpline Number:",
        whatsapp_label: info.whatsapp_label || "WhatsApp:",
        email_label: info.email_label || "Email:",
      });
    }
  }, [info, reset]);

  const onSubmit = (data) => mutation.mutate(data);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full m-0 md:m-2">
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-2 bg-clip-text text-white tracking-tight">
          Update Header & Help Desk Info
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Top Menu Phone Number - separate section */}
          <div className="mb-8 rounded-lg border border-teal-800 bg-teal-950/80 p-4">
            <h2 className="text-lg font-bold text-teal-300 mb-2">
              Header (Top Menu)
            </h2>
            <div>
              <label className="block font-medium mb-1 text-gray-200">
                Top Menu Phone Number{" "}
                <span className="text-xs text-gray-400">
                  (only shown in top menu/header)
                </span>
              </label>
              <input
                {...register("top_menu_phone")}
                className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                placeholder="e.g. +8801XXXXXXXXX"
              />
            </div>
          </div>
          {/* Help Desk fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-200">
                Panel Title
              </label>
              <input
                {...register("title")}
                className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
              />
            </div>

            {/* Helpline Row */}
            <div className="col-span-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-gray-200">
                  Helpline Label
                </label>
                <input
                  {...register("helpline_label")}
                  className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                  placeholder="e.g. Helpline Number:"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-gray-200">
                  Number
                </label>
                <input
                  {...register("helpline_number")}
                  className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                  placeholder="e.g. +8801XXXXXXXXX"
                />
              </div>
            </div>

            {/* WhatsApp Row */}
            <div className="col-span-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-gray-200">
                  WhatsApp Label
                </label>
                <input
                  {...register("whatsapp_label")}
                  className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                  placeholder="e.g. WhatsApp:"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-gray-200">
                  Number
                </label>
                <input
                  {...register("whatsapp")}
                  className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                  placeholder="e.g. +8801XXXXXXXXX"
                />
              </div>
            </div>

            {/* Email Row */}
            <div className="col-span-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-gray-200">
                  Email Label
                </label>
                <input
                  {...register("email_label")}
                  className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                  placeholder="e.g. Email:"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-gray-200">
                  Email
                </label>
                <input
                  {...register("email")}
                  className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                  placeholder="e.g. support@example.com"
                />
              </div>
            </div>

            {/* Contact Button Label & Link */}
            <div>
              <label className="block font-medium mb-1 text-gray-200">
                Button Label
              </label>
              <input
                {...register("contact_btn_label")}
                className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                placeholder="e.g. Contact Us"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-200">
                Button Link
              </label>
              <input
                {...register("contact_btn_link")}
                className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                placeholder="e.g. /contact-us"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-200">
                Tooltip Text
              </label>
              <input
                {...register("tooltip_text")}
                className="w-full border border-gray-700 focus:outline-none focus:border focus:border-teal-400 p-2 rounded-lg bg-gray-800 text-white"
                placeholder="e.g. Need Support?"
              />
            </div>
          </div>
          <div className="mt-6">
            <Button
              text="Save Changes"
              disabled={mutation.isPending}
              className="cursor-pointer !rounded-lg !text-base"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateHelpDesk;
