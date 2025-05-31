import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import { FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminUpdateWeProvide = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const fileInputs = useRef([]);

  const { data } = useQuery({
    queryKey: ["weProvide"],
    queryFn: async () => (await axiosPublicUrl.get("/api/we-provide")).data,
  });

  const { control, handleSubmit, reset, register, setValue, watch } = useForm({
    defaultValues: { items: Array(3).fill({}) },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (formData) => {
    const dataToSend = new FormData();
    dataToSend.append(
      "items",
      JSON.stringify(
        formData.items.map((item, index) => ({
          ...item,
          oldImage: data[index]?.image || "", // send the original image if not updated
        }))
      )
    );
    fileInputs.current.forEach((input, index) => {
      if (input?.files?.[0]) {
        // Use a unique field name per file to keep the order/index
        dataToSend.append(`images[${index}]`, input.files[0]);
      }
    });      

    try {
      await axiosPublicUrl.put("/api/we-provide", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      queryClient.invalidateQueries(["weProvide"]);
      Swal.fire("Success", "We Provide section updated!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Failed to update",
        "error"
      );
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        items: data.map((item) => ({
          ...item,
          image: item.image
            ? `${import.meta.env.VITE_OPEN_APIURL}${item.image}`
            : "",
          oldImage: item.image || "",
        })),
      });
    }
  }, [data, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-teal-500">
        Update WE PROVIDE
      </h2>
      {fields?.map((item, idx) => (
        <div
          key={item.id || idx}
          className="border border-gray-700 rounded-md p-4 mb-2"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-2 rounded flex items-center justify-center overflow-hidden border">
                <img
                  src={
                    watch(`items.${idx}.image`) ||
                    "/uploads/we-provide/default-we-provide.jpg"
                  }
                  alt="preview"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = "/uploads/we-provide/default-we-provide.jpg";
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputs.current[idx] = el)}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setValue(`items.${idx}.image`, event.target.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="bg-teal-600 cursor-pointer hover:bg-teal-500 text-white px-3 py-2 rounded flex items-center gap-1 text-sm mt-1"
                onClick={() => fileInputs.current[idx]?.click()}
              >
                <FaUpload /> Upload
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-2 w-full">
              <input
                {...register(`items.${idx}.title`, { required: true })}
                placeholder="Title"
                className="border border-gray-700 focus:outline-none p-2 rounded text-white placeholder-gray-400"
              />
              <textarea
                {...register(`items.${idx}.description`, { required: true })}
                placeholder="Description"
                className="border border-gray-700 p-2 focus:outline-none rounded text-white placeholder-gray-400"
                rows={3}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-6 py-1.5 rounded font-bold"
      >
        Save Changes
      </button>
    </form>
  );
};

export default AdminUpdateWeProvide;
