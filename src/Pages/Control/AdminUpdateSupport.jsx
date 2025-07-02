import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";
import { Editor } from "@tinymce/tinymce-react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const AdminUpdateSupport = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data: supportContent, isLoading } = useQuery({
    queryKey: ["supportContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/support-content");
      return response.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosPublicUrl.put(
        "/api/support-content",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["supportContent"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Support content updated successfully",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update content",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    },
  });

  const { register, handleSubmit, control, reset } = useForm();

  const {
    fields: instrumentTypeFields,
    append: appendInstrumentType,
    remove: removeInstrumentType,
  } = useFieldArray({
    control,
    name: "instrument_types",
  });

  useEffect(() => {
    if (supportContent) {
      reset({
        instrument_types: supportContent.instrument_types || [],
        description: supportContent.description || "",
      });
    }
  }, [supportContent, reset]);

  const onSubmit = async (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full overflow-y-auto m-0 md:m-2">
      <div className="rounded-lg border border-gray-800 shadow-2xl mb-4 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-8 bg-clip-text  tracking-tight">
          Update Support Page Instrument Types
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block font-semibold text-gray-200 mb-2"
            >
              Support Request Form Top Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_APIKEY}
                  value={field.value}
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | fontselect fontsizeselect | " +
                      "bold italic underline removeformat | forecolor backcolor | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | link image media table | " +
                      "preview fullscreen | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                />
              )}
            />
          </div>

          {/* Instrument Types */}
          <div className="rounded-2xl border border-gray-800 bg-gray-800/80 p-6 shadow">
            <h2 className="text-lg font-bold mb-4 text-teal-300 tracking-wide">
              Instrument Types
            </h2>
            <div className="space-y-3">
              {instrumentTypeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input
                    {...register(`instrument_types.${index}`)}
                    className="flex-1 p-2 border border-gray-600 rounded-lg text-sm bg-gray-900 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="Enter instrument type"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstrumentType(index)}
                    className="text-red-500 hover:text-red-700 rounded-full cursor-pointer p-2 bg-gray-900 hover:bg-gray-800 shadow transition"
                    title="Remove instrument type"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendInstrumentType("")}
                className="flex items-center cursor-pointer gap-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 rounded-xl shadow mt-2 hover:from-teal-600 hover:to-cyan-700 transition"
              >
                <FaPlus /> Add Instrument Type
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              text={
                updateMutation.isPending
                  ? "Updating..."
                  : "Update Support Content"
              }
              type="submit"
              className="text-base px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-700 shadow transition"
              disabled={updateMutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateSupport;
