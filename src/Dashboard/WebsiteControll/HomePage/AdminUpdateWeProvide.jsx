import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import { FaUpload } from "react-icons/fa";

const defaultImage = "https://via.placeholder.com/96x96.png?text=No+Image"; // You can put your own default

const AdminUpdateWeProvide = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const fileInputs = useRef([]);

  const { data } = useQuery({
    queryKey: ["weProvide"],
    queryFn: async () => (await axiosPublicUrl.get("/api/we-provide")).data,
  });

  const { control, handleSubmit, reset, register, setValue, watch } = useForm({
    defaultValues: { items: [{}, {}, {}] },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      axiosPublicUrl.put("/api/we-provide", formData.items),
    onSuccess: () => queryClient.invalidateQueries(["weProvide"]),
  });

  useEffect(() => {
    if (data) {
      reset({
        items: [
          ...data,
          ...Array(3 - data.length).fill({
            title: "",
            image: "",
            description: ["", "", ""],
          }),
        ].slice(0, 3),
      });
    }
  }, [data, reset]);

  // Upload handler
  const handleImageUpload = async (idx, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosPublicUrl.post("/api/we-provide/upload", formData);
    setValue(`items.${idx}.image`, res.data.imageUrl);
  };

  return (
    <form
      onSubmit={handleSubmit(mutation.mutate)}
      className="space-y-6 max-w-3xl mx-auto p-4 bg-[#18181b] rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#e62245]">
        Update WE PROVIDE
      </h2>
      {fields.map((item, idx) => (
        <div
          key={item.id || idx}
          className="border border-gray-800 rounded-md p-4 mb-2 bg-[#23232b] relative"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-2 rounded bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-700">
                <img
                  src={
                    watch(`items.${idx}.image`)
                      ? watch(`items.${idx}.image`)
                      : defaultImage
                  }
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputs.current[idx] = el)}
                onChange={(e) => {
                  if (e.target.files[0])
                    handleImageUpload(idx, e.target.files[0]);
                }}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="bg-[#e62245] text-white px-3 py-2 rounded flex items-center gap-1 text-sm"
                onClick={() => fileInputs.current[idx]?.click()}
              >
                <FaUpload /> Upload
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                {...register(`items.${idx}.title`, { required: true })}
                placeholder="Title"
                className="border border-gray-700 p-2 rounded bg-[#101014] text-white placeholder-gray-400"
              />
              <input
                {...register(`items.${idx}.description.0`, { required: true })}
                placeholder="Description line 1"
                className="border border-gray-700 p-2 rounded bg-[#101014] text-white placeholder-gray-400"
              />
              <input
                {...register(`items.${idx}.description.1`, { required: true })}
                placeholder="Description line 2"
                className="border border-gray-700 p-2 rounded bg-[#101014] text-white placeholder-gray-400"
              />
              <input
                {...register(`items.${idx}.description.2`, { required: true })}
                placeholder="Description line 3"
                className="border border-gray-700 p-2 rounded bg-[#101014] text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-2 rounded font-bold hover:bg-teal-500"
      >
        Save Changes
      </button>
    </form>
  );
};
export default AdminUpdateWeProvide;
