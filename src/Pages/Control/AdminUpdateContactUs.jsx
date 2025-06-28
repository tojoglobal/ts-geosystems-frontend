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
  const { data: contactData = {}, isLoading } = useQuery({
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
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.error || "Failed to update contact information",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
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
    defaultValues: contactData || {
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
          contactData?.phoneNumbers?.length > 0
            ? contactData?.phoneNumbers
            : [{ value: "" }],
        emails:
          contactData?.emails?.length > 0
            ? contactData.emails
            : [{ value: "" }],
        officeAddresses:
          contactData?.officeAddresses?.length > 0
            ? contactData?.officeAddresses
            : [{ value: "" }],
        socialLinks: contactData?.socialLinks || {
          facebook: "",
          twitter: "",
          youtube: "",
          instagram: "",
        },
        workingDays: contactData?.workingDays,
        weeklyHoliday: contactData?.weeklyHoliday,
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
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
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
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
      return;
    }

    updateContactMutation.mutate(filteredData);
  };

  if (isLoading || !contactData) return <Loader />;

  return (
    <div className="w-full m-0 md:m-2">
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-8 bg-clip-text text-white tracking-tight">
          Admin — Update Contact Us
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Working Days Section */}
          <section className="bg-transparent px-0 md:px-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-50">
              Working Days
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">
                  Regular Days
                </label>
                <input
                  type="text"
                  {...register("workingDays", {
                    required: "Working days information is required",
                  })}
                  className="w-full p-3 bg-gray-900 border-b border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e62245] focus:ring-0 transition"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">
                  Holiday
                </label>
                <input
                  type="text"
                  {...register("weeklyHoliday", {
                    required: "Holiday information is required",
                  })}
                  className="w-full p-3 bg-gray-900 border-b border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e62245] focus:ring-0 transition"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-800" />

          {/* Contact Information Section (Phone, Email, Address) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
            {/* Phone Numbers Section */}
            <section className="bg-transparent px-0 md:px-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-50">
                Phone Numbers
              </h2>
              <div className="space-y-2">
                {phoneFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      {...register(`phoneNumbers.${index}.value`, {
                        required: "Phone number is required",
                      })}
                      placeholder="Enter phone number"
                      className={`w-full p-3 bg-gray-900 border-b border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e62245] focus:ring-0 transition ${
                        errors.phoneNumbers?.[index]?.value
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {phoneFields.length > 1 && (
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removePhone(index)}
                        className="p-2 rounded-lg cursor-pointer bg-red-800/20 text-red-400 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPhone({ value: "" })}
                  className="py-2 px-4 cursor-pointer rounded-sm text-sm bg-[#e62245] text-white transition border-0"
                >
                  + Add Phone
                </button>
              </div>
            </section>

            {/* Email Section */}
            <section className="bg-transparent px-0 md:px-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-50">
                Email Addresses
              </h2>
              <div className="space-y-2">
                {emailFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="email"
                      {...register(`emails.${index}.value`, {
                        required: "Email address is required",
                      })}
                      placeholder="Enter email address"
                      className={`w-full p-3 bg-gray-900 border-b border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e62245] focus:ring-0 transition ${
                        errors.emails?.[index]?.value ? "border-red-500" : ""
                      }`}
                    />
                    {emailFields.length > 1 && (
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removeEmail(index)}
                        className="p-2 rounded-lg cursor-pointer bg-red-800/20 text-red-400 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addEmail({ value: "" })}
                  className="py-2 px-4 cursor-pointer rounded-sm text-sm bg-[#e62245] text-white transition border-0"
                >
                  + Add Email
                </button>
              </div>
            </section>

            {/* Office Address Section */}
            <section className="bg-transparent px-0 md:px-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-50">
                Office Addresses
              </h2>
              <div className="space-y-2">
                {addressFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <textarea
                      rows={2}
                      {...register(`officeAddresses.${index}.value`, {
                        required: "Office address is required",
                      })}
                      placeholder="Enter office address"
                      className={`w-full p-3 bg-gray-900 border-b border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e62245] focus:ring-0 transition ${
                        errors.officeAddresses?.[index]?.value
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {addressFields.length > 1 && (
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removeAddress(index)}
                        className="p-2 rounded-lg cursor-pointer bg-red-800/20 text-red-400 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addAddress({ value: "" })}
                  className="py-2 px-4 cursor-pointer rounded-sm text-sm bg-[#e62245] text-white transition border-0"
                >
                  + Add Address
                </button>
              </div>
            </section>
          </div>

          <hr className="border-gray-800" />

          {/* Social Media Section */}
          <section className="bg-transparent px-0 md:px-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-50">
              Social Media Links (Will affect on ContactUs, Mobile Navbar &
              Footer)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {["facebook", "twitter", "youtube", "instagram"].map(
                (platform) => (
                  <div key={platform}>
                    <label className="block mb-1 text-sm font-medium capitalize text-gray-400">
                      {platform}
                    </label>
                    <input
                      type="url"
                      {...register(`socialLinks.${platform}`)}
                      placeholder={`https://${platform}.com/yourpage`}
                      className="w-full p-3 bg-gray-900 border-b border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e62245] focus:ring-0 transition"
                    />
                  </div>
                )
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <Button
              text="Save Changes"
              disabled={updateContactMutation.isPending}
              className="bg-[#e62245] hover:bg-[#c81e3c] text-white text-sm px-7 py-2 rounded-lg shadow cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateContactUs;
