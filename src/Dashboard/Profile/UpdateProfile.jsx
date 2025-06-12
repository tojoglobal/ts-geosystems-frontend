/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useToastSwal from "../../Hooks/useToastSwal";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const showToast = useToastSwal();
  const axiospublicUrl = useAxiospublic();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const navaigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const photoFile = watch("photo");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiospublicUrl.get("/api/admin/profile");
        const data = response.data.data;
        setLoading(false);
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("phone", data.phone);
        setValue("facebook", data.facebook || "");
        setValue("instagram", data.instagram || "");
        setValue("linkedin", data.linkedin || "");
        setValue("twitter", data.twitter || "");
        setPreview(`${import.meta.env.VITE_OPEN_APIURL}/uploads/${data.photo}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
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
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("facebook", data.facebook || "");
    formData.append("instagram", data.instagram || "");
    formData.append("linkedin", data.linkedin || "");
    formData.append("twitter", data.twitter || "");
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    try {
      const res = await axiospublicUrl.put("/api/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        showToast("success", "Success!", "Profile updated successfully!");
        navaigate("/dashboard/viewprofile");
      }
    } catch (err) {
      showToast("error", "Error!", err.message || "Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#151825] via-[#232946] to-[#0ea5e9]">
        <div className="flex items-center gap-3 text-white text-xl font-bold">
          <Sparkles className="animate-pulse text-indigo-400" />
          Loading...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2a] via-[#22223b] to-[#151825] flex justify-center items-center p-4">
      <div className="w-full max-w-lg mx-auto bg-black/70 border-2 border-[#0ea5e9] shadow-2xl rounded-3xl px-6 py-8 relative z-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent tracking-wide text-center drop-shadow">
            Update Profile
          </h2>
          <span className="text-gray-400 text-sm text-center">
            Update your admin account details below.
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          encType="multipart/form-data"
        >
          {/* Profile Photo */}
          <div className="flex items-center gap-5">
            {preview && (
              <img
                src={preview}
                alt="Profile"
                className="w-16 h-16 object-cover rounded-full border-2 border-[#0ea5e9] shadow"
                style={{
                  minWidth: 64,
                  minHeight: 64,
                  maxWidth: 64,
                  maxHeight: 64,
                }}
              />
            )}
            <div>
              <label className="block text-sm font-medium text-[#bae6fd]">
                Profile Photo{" "}
                <span className="text-xs text-gray-400">(40x40px)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("photo", {
                  validate: {
                    size: (fileList) =>
                      !fileList[0] ||
                      fileList[0].size <= 1024 * 1024 ||
                      "Image size should be less than 1MB",
                  },
                })}
                className="mt-1 block w-full text-sm text-gray-200 file:py-1 file:px-2 file:border file:rounded-lg file:bg-[#232946] file:text-white"
              />
              <span className="text-xs text-gray-400">
                (Upload a 40x40 image for best results)
              </span>
              {errors.photo && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.photo.message}
                </p>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#bae6fd]">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`input mt-1 block w-full rounded-lg border ${
                errors.name ? "border-red-500" : "border-[#232946]"
              } bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#bae6fd]">
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
              className={`input mt-1 block w-full rounded-lg border ${
                errors.email ? "border-red-500" : "border-[#232946]"
              } bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-[#bae6fd]">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Phone number must be 10-15 digits",
                },
              })}
              className={`input mt-1 block w-full rounded-lg border ${
                errors.phone ? "border-red-500" : "border-[#232946]"
              } bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#bae6fd]">
                <FaFacebookF className="text-blue-500" /> Facebook
              </label>
              <input
                type="url"
                {...register("facebook")}
                placeholder="https://facebook.com/username"
                className="input mt-1 block w-full rounded-lg border border-[#232946] bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#bae6fd]">
                <FaInstagram className="text-pink-400" /> Instagram
              </label>
              <input
                type="url"
                {...register("instagram")}
                placeholder="https://instagram.com/username"
                className="input mt-1 block w-full rounded-lg border border-[#232946] bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#bae6fd]">
                <FaLinkedinIn className="text-blue-400" /> LinkedIn
              </label>
              <input
                type="url"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/username"
                className="input mt-1 block w-full rounded-lg border border-[#232946] bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#bae6fd]">
                <FaTwitter className="text-blue-300" /> Twitter
              </label>
              <input
                type="url"
                {...register("twitter")}
                placeholder="https://twitter.com/username"
                className="input mt-1 block w-full rounded-lg border border-[#232946] bg-[#1e213a] text-white shadow-sm focus:border-[#0ea5e9] focus:ring-[#0ea5e9] sm:text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] hover:from-[#22d3ee] hover:to-[#0ea5e9] text-white py-2 px-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
