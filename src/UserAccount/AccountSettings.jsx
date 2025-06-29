import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { usePasswordToggle } from "../utils/usePasswordToggle";

const AccountSettings = () => {
  const axiosPublicUrl = useAxiospublic();
  const { user } = useSelector((state) => state.authUser);
  const [passwordType, PasswordIcon] = usePasswordToggle();
  const [confirmPasswordType, ConfirmPasswordIcon] = usePasswordToggle();
  const [currentPasswordType, CurrentPasswordIcon] = usePasswordToggle();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });

  // Fetch user info and set default values
  const { data: UserInfo = {}, isLoading } = useQuery({
    queryKey: ["UserAccountInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosPublicUrl.get(
        `/api/getUserInfo/${user.email}`
      );
      return data;
    },
  });

  useEffect(() => {
    if (UserInfo && Object.keys(UserInfo).length > 0) {
      reset({
        firstName: UserInfo.firstName || "",
        lastName: UserInfo.lastName || "",
        companyName: UserInfo.companyName || "",
        phoneNumber: UserInfo.phoneNumber || "",
        email: UserInfo.email || "",
      });
    }
  }, [UserInfo, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosPublicUrl.put("/api/updateUserInfo", {
        id: UserInfo.id,
        ...data,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Account details updated successfully.",
          timer: 4000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error?.response?.data?.message || "An error occurred.",
        timer: 4000,
      });
    }
  };

  if (isLoading) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mx-2 md:mx-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name <span className="text-crimson-red">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name <span className="text-crimson-red">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company
          </label>
          <input
            type="text"
            id="companyName"
            {...register("companyName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register("phoneNumber")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-crimson-red">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type={passwordType}
            id="password"
            {...register("password", {
              validate: (value) => {
                if (!value || value.length === 0) return true; // allow empty password
                if (value.length >= 6 && /[a-zA-Z]/.test(value)) return true;
                return "Password must be at least 6 characters and contain a letter.";
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          <span className="absolute right-3 top-4/6 -translate-y-1/2 cursor-pointer text-gray-500">
            {PasswordIcon}
          </span>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        {/* Confirm Password */}
        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            type={confirmPasswordType}
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("password") || "Passwords must match.",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          <span className="absolute right-3 top-4/6 -translate-y-1/2 cursor-pointer text-gray-500">
            {ConfirmPasswordIcon}
          </span>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Current Password */}
        <div className="relative">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Current Password
          </label>
          <input
            type={currentPasswordType}
            id="currentPassword"
            {...register("currentPassword")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          <span className="absolute right-3 top-4/6 -translate-y-1/2 cursor-pointer text-gray-500">
            {CurrentPasswordIcon}
          </span>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="bg-crimson-red text-white px-6 py-2 text-sm rounded-sm hover:bg-red-700 transition-colors"
        >
          UPDATE DETAILS
        </button>
      </div>
    </form>
  );
};

export default AccountSettings;
