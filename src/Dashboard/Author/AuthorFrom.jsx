import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AuthorForm({
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
        <label className="block mb-1 font-medium">Author Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm md:text-base focus:outline-none focus:ring focus:ring-[#e62245] text-white"
          placeholder="Enter author name"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-teal-600 py-[6px] px-4 rounded-sm cursor-pointer hover:bg-teal-700 transition"
        >
          {isEditing ? "Update Author" : "Add Author"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-[6px] rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
