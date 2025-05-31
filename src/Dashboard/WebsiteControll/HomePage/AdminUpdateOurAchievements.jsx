import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";

const AdminUpdateOurAchievements = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["ourAchievements"],
    queryFn: async () =>
      (await axiosPublicUrl.get("/api/our-achievements")).data,
  });

  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: { items: [{}, {}, {}] },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      axiosPublicUrl.put("/api/our-achievements", formData.items),
    onSuccess: () => {
      queryClient.invalidateQueries(["ourAchievements"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Achievements updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
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
        items: [
          ...data,
          ...Array(3 - data.length).fill({ number: "", text: "" }),
        ].slice(0, 3),
      });
    }
  }, [data, reset]);

  return (
    <form
      onSubmit={handleSubmit(mutation.mutate)}
      className="space-y-6 p-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-teal-500">
        Update Our Achievements
      </h2>
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
