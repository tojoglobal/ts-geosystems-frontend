import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
    onSuccess: () => queryClient.invalidateQueries(["ourAchievements"]),
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
      className="space-y-6 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#e62245]">
        Update Our Achievements
      </h2>
      {fields.map((item, idx) => (
        <div key={item.id || idx} className="flex gap-4 items-center mb-2">
          <input
            {...register(`items.${idx}.number`, { required: true })}
            placeholder="Number"
            className="border p-2 rounded w-32"
          />
          <input
            {...register(`items.${idx}.text`, { required: true })}
            placeholder="Text"
            className="border p-2 rounded flex-1"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-2 rounded font-bold"
      >
        Save Changes
      </button>
    </form>
  );
};
export default AdminUpdateOurAchievements;
