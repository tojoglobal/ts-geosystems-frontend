import { useForm } from "react-hook-form";
import Button from "../../Dashboard/Button/Button";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Loader from "../../utils/Loader";
import { Controller } from "react-hook-form";

const AdminUpdateCertificateTracking = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data: certificateData, isLoading } = useQuery({
    queryKey: ["certificateDescription"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/certificate-description");
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      axiosPublicUrl.put("/api/certificate-description", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["certificateDescription"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Certificate description updated successfully",
      });
    },
    onError: (error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update description",
      });
    },
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "",
    },
  });

  useEffect(() => {
    if (certificateData) {
      reset({
        description: certificateData.description || "",
      });
    }
  }, [certificateData, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Admin - Update Certificate Tracking Description
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full border border-gray-600 rounded-sm p-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                placeholder="Enter certificate tracking description"
              />
            )}
          />
        </div>

        <div className="flex justify-start">
          <Button text={"Save Changes"} disabled={updateMutation.isPending} />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateCertificateTracking;
