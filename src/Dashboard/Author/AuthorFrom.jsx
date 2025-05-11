import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AuthorFrom({
  onSubmit,
  initialData,
  isEditing,
  onCancel,
  resetTrigger,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      value: "",
      status: 0,
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
        <label className="block mb-1 font-medium">Tax Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          placeholder="enter taxte name"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Value (%)</label>
        <input
          type="number"
          step="0.01"
          {...register("value")}
          className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          placeholder="use vlaue %"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          {...register("status")}
          className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select Status</option>
          <option value={0}>Inactive</option>
          <option value={1}>Active</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-teal-600 py-2 px-4 rounded-md hover:bg-teal-700 transition"
        >
          {isEditing ? "Update Tax" : "Add Tax"}
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
