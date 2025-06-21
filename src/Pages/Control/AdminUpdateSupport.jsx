import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";
import { Editor } from "@tinymce/tinymce-react";

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
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update content",
      });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  console.log(errors);

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
    <div className="overflow-y-auto">
      <h1 className="text-lg font-semibold mb-2">
        Update Support Page Instrument Types
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Description Section */}
        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium text-sm">
            Support Request Form top Description
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

        <div className="rounded p-3 border border-gray-700">
          <h2 className="text-base font-semibold mb-2">Instrument Types</h2>
          <div className="space-y-2">
            {instrumentTypeFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`instrument_types.${index}`)}
                  className="flex-1 p-1.5 border border-gray-600 rounded text-sm"
                  placeholder="Enter instrument type"
                />
                <button
                  type="button"
                  onClick={() => removeInstrumentType(index)}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendInstrumentType("")}
              className="text-blue-500 cursor-pointer text-sm mt-1 hover:underline"
            >
              + Add Instrument Type
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            text={"Update Support Content"}
            type="submit"
            className="text-sm px-4 py-2"
          />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateSupport;
