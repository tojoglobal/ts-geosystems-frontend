/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { EditIcon } from "lucide-react";
import { useAxiospublic } from "./../../Hooks/useAxiospublic";
import Swal from "sweetalert2";

// Default slides structure
const defaultSlides = Array(6)
  .fill()
  .map((_, i) => ({
    id: i + 1,
    productName: "",
    productLink: "",
    productDescription: "",
    imageUrl: "",
  }));

// Slide field config
const slideFieldsConfig = {
  1: ["image"],
  2: ["productName", "productDescription", "productLink", "image"],
  3: ["productName", "productDescription", "productLink", "image"],
  4: ["productName", "productDescription", "productLink", "image"],
  5: ["productName", "productDescription", "image"],
  6: ["productName", "productDescription", "image"],
};

const SlideContorols = () => {
  const axiosPublicUrl = useAxiospublic();
  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlideId, setCurrentSlideId] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: slides[0],
  });

  const currentSlide = slides.find((s) => s.id === currentSlideId);
  const fields = slideFieldsConfig[currentSlideId] || [];

  useEffect(() => {
    if (currentSlide) {
      reset(currentSlide);
    }
  }, [currentSlideId, reset, currentSlide]);

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await axiosPublicUrl.get("/api/slides");
      const data = await res?.data;
      setSlides(data);
    };

    fetchSlides();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setValue("imageUrl", imageUrl);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("productName", data.productName || "");
    formData.append("productLink", data.productLink || "");
    formData.append("productDescription", data.productDescription || "");

    // Only append file if user selected a new one
    const imageInput = document.querySelector('input[type="file"]');
    if (imageInput.files[0]) {
      formData.append("imageUrl", imageInput.files[0]);
    }

    try {
      const response = await axiosPublicUrl.put(
        `/api/slides/${currentSlideId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data) {
        Swal.fire("Success", `Slide ${currentSlideId} updated!`, "success");
      } else {
        Swal.fire("Error", "Failed to update slide", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-teal-600">Hero Banner Editor</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {slides.map((slide) => (
          <Button
            key={slide.id}
            variant={slide.id === currentSlideId ? "default" : "outline"}
            onClick={() => setCurrentSlideId(slide.id)}
          >
            Slide {slide.id}
          </Button>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Slide {currentSlideId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.includes("productName") && (
              <div>
                <Label>Product Name</Label>
                <Input {...register("productName", { required: true })} />
                {errors.productName && (
                  <span className="text-red-500 text-sm">
                    Product name is required
                  </span>
                )}
              </div>
            )}
            {fields.includes("productDescription") && (
              <div>
                <Label>Description</Label>
                <Textarea
                  {...register("productDescription", { required: true })}
                />
                {errors.productDescription && (
                  <span className="text-red-500 text-sm">
                    Description is required
                  </span>
                )}
              </div>
            )}
            {fields.includes("productLink") && (
              <div>
                <Label>Product URL</Label>
                <Input
                  {...register("productLink", {
                    required: true,
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                      message: "Enter a valid URL",
                    },
                  })}
                />
                {errors.productLink && (
                  <span className="text-red-500 text-sm">
                    {errors.productLink.message || "URL is required"}
                  </span>
                )}
              </div>
            )}
            {fields.includes("image") && (
              <div>
                <Label>Slide Image</Label>
                <div className="relative rounded-md">
                  <div className="absolute top-2 right-2">
                    <label className="cursor-pointer flex items-center gap-1 text-sm text-blue-500">
                      <EditIcon size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      Change
                    </label>
                  </div>
                  <div className="md:h-48 flex items-center justify-center bg-muted overflow-hidden">
                    {watch("image")?.[0] ? (
                      <img
                        src={URL.createObjectURL(watch("image")[0])}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : watch("image_url") ? (
                      <img
                        src={`${import.meta.env.VITE_OPEN_APIURL}${watch(
                          "image_url"
                        )}`}
                        alt="Existing Image"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No Image Selected</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Update Slide {currentSlideId}</Button>
        </div>
      </form>
    </div>
  );
};

export default SlideContorols;
