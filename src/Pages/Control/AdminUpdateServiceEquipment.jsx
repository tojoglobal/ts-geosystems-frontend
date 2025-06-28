import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";

const AdminUpdateServiceEquipment = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data: serviceEquipment, isLoading } = useQuery({
    queryKey: ["serviceEquipment"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get(
        "/api/service-equipment-options"
      );
      return response.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosPublicUrl.put(
        "/api/service-equipment-options",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serviceEquipment"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Service equipment options updated successfully",
        timer: 4000,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update options",
        timer: 4000,
      });
    },
  });

  const { register, handleSubmit, control, reset } = useForm();

  const {
    fields: equipmentFields,
    append: appendEquipment,
    remove: removeEquipment,
  } = useFieldArray({
    control,
    name: "equipment_options",
  });

  useEffect(() => {
    if (serviceEquipment) {
      reset({
        equipment_options: serviceEquipment.equipment_options || [],
      });
    }
  }, [serviceEquipment, reset]);

  const onSubmit = async (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-y-auto max-w-2xl my-10">
      <h1 className="text-lg font-semibold mb-2">
        Update Service Equipment Options
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="rounded p-3 border border-gray-600">
          <h2 className="text-base font-semibold mb-2">Equipment Options</h2>
          <div className="space-y-1">
            {equipmentFields.map((field, index) => (
              <div key={field.id} className="flex gap-1">
                <input
                  {...register(`equipment_options.${index}`)}
                  className="flex-1 p-1.5 border border-gray-600 focus:outline-none rounded text-sm"
                  placeholder="Enter equipment option"
                />
                <button
                  type="button"
                  onClick={() => removeEquipment(index)}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendEquipment("")}
              className="text-blue-500 cursor-pointer text-sm mt-1 hover:underline"
            >
              + Add Equipment Option
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            text={"Update Equipment Options"}
            type="submit"
            className="text-sm px-4 py-2"
          />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateServiceEquipment;
