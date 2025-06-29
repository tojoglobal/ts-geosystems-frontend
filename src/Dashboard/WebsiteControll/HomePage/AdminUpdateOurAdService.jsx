import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import { FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminUpdateOurAdService = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data = {} } = useQuery({
    queryKey: ["ourAdServices"],
    queryFn: async () =>
      (await axiosPublicUrl.get("/api/our-ad-services")).data,
  });

  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: { section_title: "", items: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      axiosPublicUrl.put("/api/our-ad-services", {
        section_title: formData.section_title,
        items: formData.items,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["ourAdServices"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Our Advantage & Services updated successfully.",
        timer: 4000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while updating. Please try again.",
        timer: 4000,
      });
    },
  });

  useEffect(() => {
    if (data)
      reset({
        section_title: data.section_title || "",
        items: data.items || [],
      });
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-teal-400">
        Update {data?.section_title || ""}
      </h2>
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-gray-200">
          Section Title
        </label>
        <input
          {...register("section_title", { required: true })}
          placeholder="Section Title"
          className="border border-gray-600 bg-gray-800 focus:outline-none text-white p-2 rounded w-full"
        />
      </div>
      {fields.map((item, idx) => (
        <div
          key={item.id || idx}
          className="border border-gray-600 rounded-md p-3 mb-4 relative"
        >
          <button
            type="button"
            className="absolute cursor-pointer top-3 right-3 text-red-400 hover:text-red-300"
            onClick={() => remove(idx)}
          >
            <FaTrash />
          </button>
          <input
            {...register(`items.${idx}.title`, { required: true })}
            placeholder="Title"
            className="border border-gray-600 bg-gray-800 focus:outline-none text-white p-2 rounded w-full mb-2"
          />
          <textarea
            {...register(`items.${idx}.description`, { required: true })}
            placeholder="Description"
            className="border border-gray-600 bg-gray-800 focus:outline-none text-white p-2 rounded w-full"
            rows={2}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ title: "", description: "" })}
        className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded flex items-center gap-1 transition-colors"
      >
        <FaPlus /> Add More
      </button>
      <button
        type="submit"
        className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-6 py-1.5 rounded font-bold transition-colors"
      >
        Save Changes
      </button>
    </form>
  );
};
export default AdminUpdateOurAdService;
