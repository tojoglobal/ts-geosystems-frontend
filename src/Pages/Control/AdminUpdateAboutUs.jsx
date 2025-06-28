import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";
import AboutUsImgesControlls from "../../Dashboard/WebsiteControll/AboutUsPage/AboutUsImgesControlls";

const AdminUpdateAboutUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/about-us");
      return response.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosPublicUrl.put("/api/about-us", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["aboutContent"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "About Us content updated successfully",
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
        text: error?.response?.data?.message || "Failed to update content",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "section2_points",
  });

  useEffect(() => {
    if (aboutContent) {
      reset({
        section1_title: aboutContent.section1_title || "",
        section1_description: aboutContent.section1_description || "",
        section2_title: aboutContent.section2_title || "",
        section2_points: aboutContent.section2_points || [],
        section3_title: aboutContent.section3_title || "",
        section3_description: aboutContent.section3_description || "",
        section4_title: aboutContent.section4_title || "",
        section4_description: aboutContent.section4_description || "",
        section5_title: aboutContent.section5_title || "",
        section5_description: aboutContent.section5_description || "",
        section6_title: aboutContent.section6_title || "",
        section6_description: aboutContent.section6_description || "",
        section7_title: aboutContent.section7_title || "",
        section7_description: aboutContent.section7_description || "",
        section8_title: aboutContent.section8_title || "",
        section8_description: aboutContent.section8_description || "",
        section9_title: aboutContent.section9_title || "",
        section9_description: aboutContent.section9_description || "",
      });
    }
  }, [aboutContent, reset]);

  // const onDrop = (acceptedFiles, setImage) => {
  //   if (acceptedFiles?.length) {
  //     setImage(acceptedFiles[0]);
  //   }
  // };

  // const {
  //   getRootProps: getWhoWeServeProps,
  //   getInputProps: getWhoWeServeInputProps,
  // } = useDropzone({
  //   onDrop: (files) => onDrop(files, setWhoWeServeImage),
  //   accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  //   maxFiles: 1,
  // });

  // const {
  //   getRootProps: getBottomSectionProps,
  //   getInputProps: getBottomSectionInputProps,
  // } = useDropzone({
  //   onDrop: (files) => onDrop(files, setBottomSectionImage),
  //   accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  //   maxFiles: 1,
  // });

  // Function to strip HTML tags and send plain text
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "section2_points") {
        formData.append(key, JSON.stringify(value));
      } else if (key.includes("_description")) {
        formData.append(key, stripHtml(value));
      } else {
        formData.append(key, value);
      }
    });
    updateMutation.mutate(formData);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full m-0 md:m-2">
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-8 bg-clip-text text-white tracking-tight">
          Update About Us Page
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sectionNum) => (
              <div
                key={sectionNum}
                className="rounded-lg p-4 border border-gray-800 bg-gray-800/80"
              >
                <h2 className="text-base font-semibold mb-2 text-teal-300">
                  Section {sectionNum}
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm mb-1 text-gray-200">
                      Title
                    </label>
                    <input
                      {...register(`section${sectionNum}_title`)}
                      className="w-full p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                    />
                  </div>
                  {sectionNum === 2 ? (
                    <div>
                      <label className="block text-sm mb-1 text-gray-200">
                        Points
                      </label>
                      <div className="space-y-1">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-1">
                            <input
                              {...register(`section2_points.${index}`)}
                              className="flex-1 p-2 border border-gray-800 rounded-lg text-sm bg-gray-900 text-white"
                              placeholder="Enter point"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 cursor-pointer bg-gray-900 rounded-lg px-2 py-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => append("")}
                          className="text-blue-500 text-sm mt-1 hover:underline font-semibold cursor-pointer"
                        >
                          + Add Point
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm mb-1 text-gray-200">
                        Description
                      </label>
                      <Controller
                        name={`section${sectionNum}_description`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            apiKey={import.meta.env.VITE_TINY_APIKEY}
                            value={field.value}
                            onEditorChange={(content) =>
                              field.onChange(content)
                            }
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
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded">
            <h2 className="text-base font-semibold mb-2">Who We Serve Image</h2>
            <div
              {...getWhoWeServeProps()}
              className="border-2 border-dashed p-3 rounded text-center text-sm cursor-pointer"
            >
              <input {...getWhoWeServeInputProps()} />
              <p>Click or drag image here</p>
            </div>
            {whoWeServeImage ? (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(whoWeServeImage)}
                  alt="Preview"
                  className="max-h-32 mx-auto"
                />
              </div>
            ) : (
              existingImages.who_we_serve_image && (
                <div className="mt-2">
                  <img
                    src={`${import.meta.env.VITE_OPEN_APIURL}${
                      existingImages.who_we_serve_image
                    }`}
                    alt="Current"
                    className="max-h-32 mx-auto"
                  />
                </div>
              )
            )}
          </div>
          <div className="rounded">
            <h2 className="text-base font-semibold mb-2">
              Bottom Section Image
            </h2>
            <div
              {...getBottomSectionProps()}
              className="border-2 border-dashed p-3 rounded text-center text-sm cursor-pointer"
            >
              <input {...getBottomSectionInputProps()} />
              <p>Click or drag image here</p>
            </div>
            {bottomSectionImage ? (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(bottomSectionImage)}
                  alt="Preview"
                  className="max-h-32 mx-auto"
                />
              </div>
            ) : (
              existingImages.bottom_section_image && (
                <div className="mt-2">
                  <img
                    src={`${import.meta.env.VITE_OPEN_APIURL}${
                      existingImages.bottom_section_image
                    }`}
                    alt="Current"
                    className="max-h-32 mx-auto"
                  />
                </div>
              )
            )}
          </div>
        </div> */}
          <div className="flex justify-end">
            <Button
              text={"Update About Us"}
              type="submit"
              className="text-base px-8 py-3 !rounded-lg cursor-pointer"
            />
          </div>
        </form>
        <AboutUsImgesControlls />
      </div>
    </div>
  );
};

export default AdminUpdateAboutUs;
