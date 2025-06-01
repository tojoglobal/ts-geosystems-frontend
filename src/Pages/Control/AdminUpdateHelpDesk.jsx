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
      Swal.fire({ icon: "success", title: "Updated!" });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update",
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
      });
    }
  }, [info, reset]);

  const onSubmit = (data) => mutation.mutate(data);

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Admin - Update Help Desk Info
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Panel Title</label>
            <input
              {...register("title")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Helpline Number</label>
            <input
              {...register("helpline_number")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">WhatsApp</label>
            <input
              {...register("whatsapp")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Support Email</label>
            <input
              {...register("email")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Contact Button Label
            </label>
            <input
              {...register("contact_btn_label")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Contact Button Link
            </label>
            <input
              {...register("contact_btn_link")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tooltip Text</label>
            <input
              {...register("tooltip_text")}
              className="w-full border border-gray-600 focus:outline-none focus:border focus:border-gray-500 p-2 rounded"
            />
          </div>
        </div>
        <div className="mt-5">
          <Button text="Save Changes" disabled={mutation.isPending} />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateHelpDesk;
