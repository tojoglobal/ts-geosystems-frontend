import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";

const AdminUpdateOurAchievements = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data = {} } = useQuery({
    queryKey: ["ourAchievements"],
    queryFn: async () =>
      (await axiosPublicUrl.get("/api/our-achievements")).data,
  });

  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: { section_title: "", items: [{}, {}, {}] },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      axiosPublicUrl.put("/api/our-achievements", {
        section_title: formData.section_title,
        items: formData.items,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["ourAchievements"]);
      Swal.fire("Success", "Achievements updated successfully.", "success");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update achievements. Please try again.",
      });
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        section_title: data.section_title || "",
        items: [
          ...(data.items || []),
          ...Array(3 - (data.items?.length || 0)).fill({
            number: "",
            text: "",
          }),
        ].slice(0, 3),
      });
    }
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-teal-500">
        Update {data?.section_title || ""}
      </h2>
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-gray-200">
          Section Title
        </label>
        <input
          {...register("section_title", { required: true })}
          placeholder="Section Title"
          className="bg-gray-700 border focus:outline-none border-gray-600 p-2 rounded w-full text-white placeholder-gray-400"
        />
      </div>
      {fields.map((item, idx) => (
        <div key={item.id || idx} className="flex gap-4 items-center mb-2">
          <input
            {...register(`items.${idx}.number`, { required: true })}
            placeholder="Number"
            className="bg-gray-700 border focus:outline-none border-gray-600 p-2 rounded w-32 text-white placeholder-gray-400"
          />
          <input
            {...register(`items.${idx}.text`, { required: true })}
            placeholder="Text"
            className="bg-gray-700 border focus:outline-none border-gray-600 p-2 rounded flex-1 text-white placeholder-gray-400"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-teal-600 cursor-pointer
         mt-2 hover:bg-teal-700 text-white px-6 py-1.5 rounded font-bold"
      >
        Save Changes
      </button>
    </form>
  );
};
export default AdminUpdateOurAchievements;
