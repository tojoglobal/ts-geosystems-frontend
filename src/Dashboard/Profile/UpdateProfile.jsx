import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useToastSwal from "../../Hooks/useToastSwal";

const UpdateProfile = () => {
  const showToast = useToastSwal();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const photoFile = watch("photo");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/admin/profile", {
          withCredentials: true,
        });
        const data = response.data.data;
        setUserData(data);
        setLoading(false);

        setValue("id", data.id);
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("phone", data.phone);
        setPreview(`/uploads/admin/${data.photo}`); // Adjust path if needed
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setValue]);

  // Handle photo preview when file changes
  useEffect(() => {
    if (photoFile && photoFile[0]) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(photoFile[0]);
    }
  }, [photoFile]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    try {
      await axios.put("/api/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showToast("success", "Success!", "Profile updated successfully!");
    } catch (err) {
      showToast("error", "Error!", err.message || "Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <input type="hidden" {...register("id")} />

          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="text-sm text-gray-600"
            />
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`mt-1 block w-full rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              className={`mt-1 block w-full rounded-md border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
