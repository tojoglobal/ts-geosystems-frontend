import { useForm, useFieldArray } from "react-hook-form";
import Button from "../../Dashboard/Button/Button";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AdminUpdateContactUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumbers: [{ value: "" }],
      emails: [{ value: "" }],
      officeAddresses: [{ value: "" }],
    },
  });

  const { fields: phoneFields, append: addPhone } = useFieldArray({
    control,
    name: "phoneNumbers",
  });

  const { fields: emailFields, append: addEmail } = useFieldArray({
    control,
    name: "emails",
  });

  const { fields: addressFields, append: addAddress } = useFieldArray({
    control,
    name: "officeAddresses",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosPublicUrl.put("/api/admin-contact-us", data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Contact information updated successfully",
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.error || "Failed to update contact information",
      });
    }
  };

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
                At least one phone number is required
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
                At least one email address is required
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
                At least one office address is required
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 space-y-4">
          <Button text={"Submit Contact Us"} />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateContactUs;
