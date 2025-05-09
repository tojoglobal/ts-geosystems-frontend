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
      socialLinks: data.socialLinks, // Include socialLinks in the submitted data
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Update Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold">Contact</h2>
          <div className="space-y-4">
            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <input
                  type="text"
                  {...register(`phoneNumbers.${index}.value`, {
                    required: "Phone number is required",
                  })}
                  placeholder="Enter phone number"
                  className={`border p-2 rounded flex-1 ${
                    errors.phoneNumbers?.[index]?.value ? "border-red-500" : ""
                  }`}
                />
                {phoneFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPhone({ value: "" })}
              className="bg-teal-600 text-white px-3 py-1 rounded"
            >
              + Add Phone Number
            </button>
            {errors.phoneNumbers && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumbers.message ||
                  "At least one phone number is required"}
              </p>
            )}
          </div>
        </div>

        {/* Email Section */}
        <div>
          <h2 className="text-lg font-semibold">Email</h2>
          <div className="space-y-4">
            {emailFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <input
                  type="email"
                  {...register(`emails.${index}.value`, {
                    required: "Email address is required",
                  })}
                  placeholder="Enter email address"
                  className={`border p-2 rounded flex-1 ${
                    errors.emails?.[index]?.value ? "border-red-500" : ""
                  }`}
                />
                {emailFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addEmail({ value: "" })}
              className="bg-teal-600 text-white px-3 py-1 rounded"
            >
              + Add Email Address
            </button>
            {errors.emails && (
              <p className="text-red-500 text-sm">
                {errors.emails.message ||
                  "At least one email address is required"}
              </p>
            )}
          </div>
        </div>

        {/* Office Address Section */}
        <div>
          <h2 className="text-lg font-semibold">Office Address</h2>
          <div className="space-y-4">
            {addressFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <textarea
                  {...register(`officeAddresses.${index}.value`, {
                    required: "Office address is required",
                  })}
                  placeholder="Enter office address"
                  className={`border p-2 rounded flex-1 ${
                    errors.officeAddresses?.[index]?.value
                      ? "border-red-500"
                      : ""
                  }`}
                  rows={2}
                ></textarea>
                {addressFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddress(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addAddress({ value: "" })}
              className="bg-teal-600 text-white px-3 py-1 rounded"
            >
              + Add Office Address
            </button>
            {errors.officeAddresses && (
              <p className="text-red-500 text-sm">
                {errors.officeAddresses.message ||
                  "At least one office address is required"}
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Social Media Links</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-24">Facebook:</label>
              <input
                type="url"
                {...register("socialLinks.facebook")}
                placeholder="https://facebook.com/yourpage"
                className="border p-2 rounded flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">Twitter:</label>
              <input
                type="url"
                {...register("socialLinks.twitter")}
                placeholder="https://twitter.com/yourpage"
                className="border p-2 rounded flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">YouTube:</label>
              <input
                type="url"
                {...register("socialLinks.youtube")}
                placeholder="https://youtube.com/yourchannel"
                className="border p-2 rounded flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">Instagram:</label>
              <input
                type="url"
                {...register("socialLinks.instagram")}
                placeholder="https://instagram.com/yourpage"
                className="border p-2 rounded flex-1"
              />
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="col-span-1 space-y-4">
          <Button
            text={"Submit Contact Us"}
            disabled={updateContactMutation.isPending}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateContactUs;
