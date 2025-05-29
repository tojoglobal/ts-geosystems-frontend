import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import { FaTrash, FaPlus } from "react-icons/fa";

const AdminUpdateOurAdService = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["ourAdServices"],
    queryFn: async () =>
      (await axiosPublicUrl.get("/api/our-ad-services")).data,
  });

  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: { items: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      axiosPublicUrl.put("/api/our-ad-services", formData.items),
    onSuccess: () => queryClient.invalidateQueries(["ourAdServices"]),
  });

  useEffect(() => {
    if (data) reset({ items: data });
  }, [data, reset]);

  return (
    <form
      onSubmit={handleSubmit(mutation.mutate)}
      className="space-y-6 max-w-3xl mx-auto p-4 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#e62245]">
        OUR ADVANTAGE & SERVICES
      </h2>
      {fields.map((item, idx) => (
        <div
          key={item.id || idx}
          className="border rounded-md p-4 mb-2 bg-gray-50 relative"
        >
          <button
            type="button"
            className="absolute top-3 right-3 text-red-500"
            onClick={() => remove(idx)}
          >
            <FaTrash />
          </button>
          <input
            {...register(`items.${idx}.title`, { required: true })}
            placeholder="Title"
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            {...register(`items.${idx}.description`, { required: true })}
            placeholder="Description"
            className="border p-2 rounded w-full"
            rows={2}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ title: "", description: "" })}
        className="bg-[#e62245] text-white px-4 py-2 rounded flex items-center gap-1"
      >
        <FaPlus /> Add More
      </button>
      <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-2 rounded font-bold"
      >
        Save Changes
      </button>
    </form>
  );
};
export default AdminUpdateOurAdService;
