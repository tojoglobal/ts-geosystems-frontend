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
    <div className="w-full m-0 md:m-2">
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-8 bg-clip-text text-white tracking-tight">
          Update Trade-In Page
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Section 1 */}
            <div className="rounded-lg p-4 border border-gray-800 bg-gray-800/80 mb-3">
              <h2 className="text-base font-semibold mb-2 text-teal-300">
                Section 1
              </h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1 text-gray-200">
                    Title
                  </label>
                  <input
                    {...register("title1")}
                    className="w-full p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-200">
                    Description
                  </label>
                  <Controller
                    name="description1"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        apiKey={import.meta.env.VITE_TINY_APIKEY}
                        value={field.value}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                          height: 200,
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

            {/* Section 2 - Buying Process */}
            <div className="rounded-lg p-4 border border-gray-800 bg-gray-800/80 mb-3">
              <h2 className="text-base font-semibold mb-2 text-teal-300">
                Section 2 - Buying Process
              </h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1 text-gray-200">
                    Title
                  </label>
                  <input
                    {...register("title2")}
                    className="w-full p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-200">
                    Process Points
                  </label>
                  <div className="space-y-1">
                    {processPointsFields.map((field, index) => (
                      <div key={field.id} className="flex gap-1">
                        <input
                          {...register(`process_points.${index}`)}
                          className="flex-1 p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                          placeholder="Enter process point"
                        />
                        <button
                          type="button"
                          onClick={() => removeProcessPoint(index)}
                          className="text-red-500 cursor-pointer hover:text-red-700 rounded-lg px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendProcessPoint("")}
                      className="text-blue-500 cursor-pointer text-sm mt-1 hover:underline font-semibold"
                    >
                      + Add Process Point
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 - Trade-Ins */}
            <div className="rounded-lg p-4 border border-gray-800 bg-gray-800/80 mb-3">
              <h2 className="text-base font-semibold mb-2 text-teal-300">
                Section 3 - Trade-Ins
              </h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1 text-gray-200">
                    Title
                  </label>
                  <input
                    {...register("title3")}
                    className="w-full p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-200">
                    Description
                  </label>
                  <Controller
                    name="description3"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        apiKey={import.meta.env.VITE_TINY_APIKEY}
                        value={field.value}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                          height: 200,
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

            {/* Instrument Makes */}
            <div className="rounded-lg p-4 border border-gray-800 bg-gray-800/80 mb-3">
              <h2 className="text-base font-semibold mb-2 text-teal-300">
                Instrument Makes
              </h2>
              <div className="space-y-1">
                {instrumentMakesFields.map((field, index) => (
                  <div key={field.id} className="flex gap-1">
                    <input
                      {...register(`instrument_makes.${index}`)}
                      className="flex-1 p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                      placeholder="Enter instrument make"
                    />
                    <button
                      type="button"
                      onClick={() => removeInstrumentMake(index)}
                      className="text-red-500 cursor-pointer hover:text-red-700 rounded-lg px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendInstrumentMake("")}
                  className="text-blue-500 text-sm cursor-pointer mt-1 hover:underline font-semibold"
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
              className="text-base px-8 py-3 !rounded-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateTradeIn;
