import { useForm, useFieldArray } from "react-hook-form";
import Button from "../../Dashboard/Button/Button";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Loader from "../../utils/Loader";

const AdminUpdateContactUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();

  // Fetch contact data using TanStack Query
  const { data: contactData, isLoading } = useQuery({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/admin-contact-us");
      return response.data;
    },
  });

  // Mutation for updating contact data
  const updateContactMutation = useMutation({
    mutationFn: (data) => axiosPublicUrl.put("/api/admin-contact-us", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["contactInfo"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Contact information updated successfully",
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.error || "Failed to update contact information",
      });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumbers: [{ value: "" }],
      emails: [{ value: "" }],
      officeAddresses: [{ value: "" }],
      socialLinks: {
        facebook: "",
        twitter: "",
        youtube: "",
        instagram: "",
      },
      workingDays: "",
      weeklyHoliday: "",
    },
  });

  // Reset form with fetched data when it's available
  useEffect(() => {
    if (contactData) {
      reset({
        phoneNumbers:
          contactData.phoneNumbers.length > 0
            ? contactData.phoneNumbers
            : [{ value: "" }],
        emails:
          contactData.emails.length > 0 ? contactData.emails : [{ value: "" }],
        officeAddresses:
          contactData.officeAddresses.length > 0
            ? contactData.officeAddresses
            : [{ value: "" }],
        socialLinks: contactData.socialLinks || {
          facebook: "",
          twitter: "",
          youtube: "",
          instagram: "",
        },
        workingDays: contactData.workingDays,
        weeklyHoliday: contactData.weeklyHoliday,
      });
    }
  }, [contactData, reset]);

  const {
    fields: phoneFields,
    append: addPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phoneNumbers",
    rules: { minLength: 1 },
  });

  const {
    fields: emailFields,
    append: addEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: "emails",
    rules: { minLength: 1 },
  });

  const {
    fields: addressFields,
    append: addAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "officeAddresses",
    rules: { minLength: 1 },
  });

  const onSubmit = async (data) => {
    // Validate at least one entry in each field
    if (
      data.phoneNumbers.length === 0 ||
      data.emails.length === 0 ||
      data.officeAddresses.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide at least one entry for each field",
      });
      return;
    }

    // Filter out empty values
    const filteredData = {
      phoneNumbers: data.phoneNumbers.filter(
        (item) => item.value.trim() !== ""
      ),
      emails: data.emails.filter((item) => item.value.trim() !== ""),
      officeAddresses: data.officeAddresses.filter(
        (item) => item.value.trim() !== ""
      ),
      socialLinks: data.socialLinks,
      workingDays: data.workingDays,
      weeklyHoliday: data.weeklyHoliday,
    };

    // Ensure at least one entry remains after filtering
    if (
      filteredData.phoneNumbers.length === 0 ||
      filteredData.emails.length === 0 ||
      filteredData.officeAddresses.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide at least one valid entry for each field",
      });
      return;
    }

    updateContactMutation.mutate(filteredData);
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">
        Admin - Update Contact Us
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Working Days Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-100">
            Working Days
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Regular Days
              </label>
              <input
                type="text"
                {...register("workingDays", {
                  required: "Working days information is required",
                })}
                className="w-full p-2 border border-gray-700 rounded-md text-sm bg-gray-900 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Holiday
              </label>
              <input
                type="text"
                {...register("weeklyHoliday", {
                  required: "Holiday information is required",
                })}
                className="w-full p-2 border border-gray-700 rounded-md text-sm bg-gray-900 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Phone Numbers Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-100">
            Phone Numbers
          </h2>
          <div className="space-y-3">
            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  {...register(`phoneNumbers.${index}.value`, {
                    required: "Phone number is required",
                  })}
                  placeholder="Enter phone number"
                  className={`w-full p-2 border rounded-md text-sm bg-gray-900 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 ${
                    errors.phoneNumbers?.[index]?.value
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
                {phoneFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="bg-red-600 text-white text-xs px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPhone({ value: "" })}
              className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
            >
              + Add Phone Number
            </button>
          </div>
        </div>

        {/* Email Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-100">
            Email Addresses
          </h2>
          <div className="space-y-3">
            {emailFields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-3">
                <input
                  type="email"
                  {...register(`emails.${index}.value`, {
                    required: "Email address is required",
                  })}
                  placeholder="Enter email address"
                  className={`w-full p-2 border rounded-md text-sm bg-gray-900 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 ${
                    errors.emails?.[index]?.value
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
                {emailFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="bg-red-600 text-white text-xs px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addEmail({ value: "" })}
              className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
            >
              + Add Email Address
            </button>
          </div>
        </div>

        {/* Office Address Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-100">
            Office Addresses
          </h2>
          <div className="space-y-3">
            {addressFields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-3">
                <textarea
                  rows={2}
                  {...register(`officeAddresses.${index}.value`, {
                    required: "Office address is required",
                  })}
                  placeholder="Enter office address"
                  className={`w-full p-2 border rounded-md text-sm bg-gray-900 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 ${
                    errors.officeAddresses?.[index]?.value
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
                {addressFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddress(index)}
                    className="bg-red-600 text-white text-xs px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addAddress({ value: "" })}
              className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
            >
              + Add Office Address
            </button>
          </div>
        </div>

        {/* Social Media Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-100">
            Social Media Links
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["facebook", "twitter", "youtube", "instagram"].map((platform) => (
              <div key={platform}>
                <label className="block mb-1 text-sm font-medium capitalize text-gray-300">
                  {platform}
                </label>
                <input
                  type="url"
                  {...register(`socialLinks.${platform}`)}
                  placeholder={`https://${platform}.com/yourpage`}
                  className="w-full p-2 border border-gray-700 rounded-md text-sm bg-gray-900 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div>
          <Button
            text="Submit Contact Us"
            disabled={updateContactMutation.isPending}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md"
          />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateContactUs;
