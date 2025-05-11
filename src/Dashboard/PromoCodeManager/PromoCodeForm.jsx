import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function PromoCodeForm({
  onSubmit,
  initialData = {},
  isEditing = false,
  onCancel,
  resetTrigger,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Reset form after successful update
  useEffect(() => {
    if (resetTrigger) reset();
  }, [resetTrigger, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded shadow space-y-4"
    >
      <input
        {...register("title")}
        placeholder="Title"
        className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
      />
      <input
        {...register("code_name")}
        placeholder="Code Name"
        className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
      />
      <input
        type="number"
        {...register("no_of_times")}
        placeholder="No of Times"
        className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
      />
      <input
        type="number"
        step="0.01"
        {...register("discount")}
        placeholder="Discount"
        className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
      />
      <select
        {...register("type")}
        className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
      >
        <option value="">Select Type</option>
        <option value="percentage">Percentage</option>
        <option value="flat">Flat</option>
      </select>
      <select
        {...register("status")}
        className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
      >
        <option value="">Select status</option>
        <option value={1}>Active</option>
        <option value={0}>Inactive</option>
      </select>
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-teal-600 text-white py-[6px] px-4 rounded-md hover:bg-teal-700 transition"
        >
          {isEditing ? "Update" : "Create"} Promo
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
