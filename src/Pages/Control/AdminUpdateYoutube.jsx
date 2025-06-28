import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import { useEffect } from "react";

const AdminUpdateYoutube = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data = {} } = useQuery({
    queryKey: ["youtubeVideos"],
    queryFn: async () => (await axiosPublicUrl.get("/api/our-youtube")).data,
  });
  console.log(data);
  const { control, handleSubmit, reset, register } = useForm({
    defaultValues: { section_title: "", items: [{ link: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const mutation = useMutation({
    mutationFn: (formData) => axiosPublicUrl.put("/api/our-youtube", formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["youtubeVideos"]);
      Swal.fire("Success", "YouTube section updated.", "success");
    },
    onError: () =>
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Update failed!",
        timer: 4000,
      }),
  });

  useEffect(() => {
    if (data) {
      reset({
        section_title: data.section_title || "",
        items: data.items?.length
          ? data.items.map((i) => ({ link: i.link }))
          : [{ link: "" }],
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
          className="border border-gray-700 focus:outline-none p-2 rounded text-white placeholder-gray-400 w-full"
        />
      </div>
      {fields.map((item, idx) => (
        <div key={item.id || idx} className="flex gap-2 items-center mb-2">
          <input
            {...register(`items.${idx}.link`, { required: true })}
            placeholder="YouTube embed link (https://www.youtube.com/embed/...)"
            className="border border-gray-700 focus:outline-none p-2 rounded text-white placeholder-gray-400 flex-1"
          />
          {fields.length > 1 && (
            <button
              type="button"
              className="text-red-400 cursor-pointer hover:text-red-300 px-2"
              onClick={() => remove(idx)}
              title="Remove"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center gap-2 mt-2">
        {fields.length < 3 && (
          <button
            type="button"
            onClick={() => append({ link: "" })}
            className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded transition-colors"
          >
            + Add Link
          </button>
        )}
        <button
          type="submit"
          className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-6 py-1.5 rounded font-bold"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default AdminUpdateYoutube;
