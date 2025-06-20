import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";

const AdminUpdateTradeIn = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data: tradeInContent, isLoading } = useQuery({
    queryKey: ["tradeInContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/trade-in-content");
      return response.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosPublicUrl.put(
        "/api/trade-in-content",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tradeInContent"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Trade-In content updated successfully",
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
    fields: processPointsFields,
    append: appendProcessPoint,
    remove: removeProcessPoint,
  } = useFieldArray({
    control,
    name: "process_points",
  });

  const {
    fields: instrumentMakesFields,
    append: appendInstrumentMake,
    remove: removeInstrumentMake,
  } = useFieldArray({
    control,
    name: "instrument_makes",
  });

  useEffect(() => {
    if (tradeInContent) {
      reset({
        title1: tradeInContent.title1 || "",
        description1: tradeInContent.description1 || "",
        title2: tradeInContent.title2 || "",
        process_points: tradeInContent.process_points || [],
        title3: tradeInContent.title3 || "",
        description3: tradeInContent.description3 || "",
        instrument_makes: tradeInContent.instrument_makes || [],
      });
    }
  }, [tradeInContent, reset]);

  const onSubmit = async (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-y-auto">
      <h1 className="text-lg font-semibold mb-2">Update Trade-In Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded p-3 border border-gray-600">
            <h2 className="text-base font-semibold mb-2">Section 1</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  {...register("title1")}
                  className="w-full p-1.5 border border-gray-600 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <Controller
                  name="description1"
                  control={control}
                  render={({ field }) => (
                    <Editor
                      apiKey={import.meta.env.VITE_TINY_APIKEY}
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        height: 150,
                        menubar: false,
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
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="rounded p-3 border border-gray-600">
            <h2 className="text-base font-semibold mb-2">
              Section 2 - Buying Process
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  {...register("title2")}
                  className="w-full p-1.5 border border-gray-600 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Process Points</label>
                <div className="space-y-1">
                  {processPointsFields.map((field, index) => (
                    <div key={field.id} className="flex gap-1">
                      <input
                        {...register(`process_points.${index}`)}
                        className="flex-1 p-1.5 border border-gray-600 rounded text-sm"
                        placeholder="Enter process point"
                      />
                      <button
                        type="button"
                        onClick={() => removeProcessPoint(index)}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendProcessPoint("")}
                    className="text-blue-500 cursor-pointer text-sm mt-1 hover:underline"
                  >
                    + Add Process Point
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded p-3 border border-gray-600">
            <h2 className="text-base font-semibold mb-2">
              Section 3 - Trade-Ins
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  {...register("title3")}
                  className="w-full p-1.5 border border-gray-600 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <Controller
                  name="description3"
                  control={control}
                  render={({ field }) => (
                    <Editor
                      apiKey={import.meta.env.VITE_TINY_APIKEY}
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        height: 150,
                        menubar: false,
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
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="rounded p-3 border border-gray-600">
            <h2 className="text-base font-semibold mb-2">Instrument Makes</h2>
            <div className="space-y-1">
              {instrumentMakesFields.map((field, index) => (
                <div key={field.id} className="flex gap-1">
                  <input
                    {...register(`instrument_makes.${index}`)}
                    className="flex-1 p-1.5 border border-gray-600 rounded text-sm"
                    placeholder="Enter instrument make"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstrumentMake(index)}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendInstrumentMake("")}
                className="text-blue-500 text-sm cursor-pointer mt-1 hover:underline"
              >
                + Add Instrument Make
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            text={"Update Trade-In"}
            type="submit"
            className="text-sm px-4 py-2"
          />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateTradeIn;
