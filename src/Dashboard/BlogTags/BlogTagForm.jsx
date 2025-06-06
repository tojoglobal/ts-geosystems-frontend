import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function BlogTagForm({
  onSubmit,
  initialData,
  isEditing,
  onCancel,
  resetTrigger,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset, resetTrigger]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded shadow space-y-4"
    >
      <div>
        <label className="block mb-1 font-medium">Tag Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm md:text-base focus:outline-none focus:ring focus:ring-[#e62245] text-white"
          placeholder="Enter tag name"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-teal-600 cursor-pointer py-2 px-4 rounded-md hover:bg-teal-700 transition"
        >
          {isEditing ? "Update Tag" : "Add Tag"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
