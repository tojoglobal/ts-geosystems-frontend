import { Link } from "react-router-dom";
import { useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { SkeletonLoader } from "../../utils/Loader/SkeletonLoader";

const SupportRequestForm = () => {
  const axiosPublicUrl = useAxiospublic();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    equipment: "",
    model: "",
    supportIssues: [],
    details: "",
    files: [],
  });

  const { data: { data: supportContent } = {}, isLoading } = useDataQuery(
    ["supportContent"],
    "/api/support-content"
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          supportIssues: [...prev.supportIssues, value],
        };
      } else {
        return {
          ...prev,
          supportIssues: prev.supportIssues.filter((item) => item !== value),
        };
      }
    });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Add all form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (key === "supportIssues") {
        form.append(key, JSON.stringify(formData[key])); // Convert array to JSON string
      } else if (key === "files") {
        formData.files.forEach((file) => {
          form.append("files", file); // Append multiple files
        });
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await axiosPublicUrl.post("/api/support", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: response.data?.message,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });

        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          equipment: "",
          model: "",
          supportIssues: [],
          details: "",
          files: [],
        });
      } else {
        console.error("Failed to submit the support request");
        Swal.fire("Error", "Failed to submit the support request", "error");
      }
    } catch (error) {
      console.error(
        "Error submitting support request:",
        error.response || error.message
      );
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An unknown error occurred.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px]">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="capitalize text-[#e62245]">
          Support
        </Link>
      </div>
      <h1 className="text-[28px] uppercase font-light mt-2 text-[#e62245] mb-6">
        SUPPORT Request Form
      </h1>
      <div className="flex flex-col items-center text-center md:flex-row md:justify-center gap-2 md:gap-7 text-sm font-normal text-[#e62245] mb-7 md:mb-16">
        <Link to="/software-downloads">SOFTWARE DOWNLOADS</Link>
        <Link to="/quick-guides">QUICK GUIDES</Link>
        <Link to="/user-manuals">USER MANUALS</Link>
        <Link to="/remote-support">REMOTE SUPPORT</Link>
      </div>
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#f4f5f9] to-[#e6e7ec] rounded-md p-3 mb-6">
        <div className="grid grid-cols-3 md:flex md:justify-center gap-[5px]">
          <Link
            to="/software-downloads"
            className="bg-[#e62245] text-[13px] text-white py-[7.66667px] px-[18.5px] rounded text-center"
          >
            Software Downloads
          </Link>
          <Link
            to="/remote-support"
            className="bg-[#e62245] text-[13px] text-white py-[7.66667px] px-[18.5px] rounded text-center"
          >
            Remote Support
          </Link>
          <Link
            to="/quick-guides"
            className="bg-[#e62245] text-[13px] text-white py-[7.66667px] px-[18.5px] rounded text-center"
          >
            Quick Guides
          </Link>
          <Link
            to="/user-manuals"
            className="bg-[#e62245] text-[13px] text-white py-[7.66667px] px-[18.5px] rounded text-center"
          >
            User Manuals
          </Link>
          <Link
            to="/cc"
            className="bg-[#e62245] text-[13px] text-white py-[7.66667px] px-[18.5px] rounded text-center"
          >
            Certificate Tracking
          </Link>
        </div>
      </div>
      <div
        className="pb-5 text-sm text-gray-700 text-center space-y-2"
        dangerouslySetInnerHTML={{ __html: supportContent?.description }}
      ></div>

      <div className="max-w-3xl mx-auto my-6">
        <h2 className="text-2xl font-semibold mb-2">Support Request Form</h2>
        <p className="mb-6 text-[15px] font-normal">
          Please fill in the form, together with your survey instrument details,
          and and our support team will be in touch. For queries please{" "}
          <Link to="/contact-us" className="text-[#e62245] underline">
            contact us...
          </Link>
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <p className="text-lg font-semibold">Contact Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full">
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Name *"
              />
              <label
                htmlFor="name"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Name *
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="company"
                id="company"
                required
                value={formData.company}
                onChange={handleInputChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Company Name *"
              />
              <label
                htmlFor="company"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Company Name *
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Email *"
              />
              <label
                htmlFor="email"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Email *
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Phone *"
              />
              <label
                htmlFor="phone"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Phone *
              </label>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-800">
            <div className="space-y-4">
              <label className="block text-lg font-semibold mb-4">
                Surveying Equipment Details
              </label>
              <div>
                <label className="block mb-1">Instrument Type *</label>
                {isLoading ? (
                  <SkeletonLoader className="w-full h-12" />
                ) : (
                  <select
                    className="w-full border p-3 appearance-none focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleInputChange}
                    required
                  >
                    <option value=""></option>
                    {supportContent.instrument_types?.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  name="model"
                  id="model"
                  required
                  value={formData.model}
                  onChange={handleInputChange}
                  className="peer w-full border border-gray-300 p-2 pt-4 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Instrument Model/Serial"
                />
                <label
                  htmlFor="model"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Instrument Model/Serial # *
                </label>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Support Issue *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    "Error Message",
                    "Firmware",
                    "Software",
                    "Training",
                    "Other...",
                  ].map((label, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={label}
                        checked={formData.supportIssues.includes(label)}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 appearance-none bg-[#e7e7e7] border border-gray-300 rounded checked:bg-[#e62245] checked:border-[#e62245] checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')]"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  name="details"
                  id="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="peer w-full border border-gray-300 p-2 pt-5 h-24 rounded placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245]"
                  placeholder="Details"
                ></textarea>
                <label
                  htmlFor="Details"
                  className="absolute left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Details
                </label>
              </div>
              <div>
                <p className="mb-2">Please attach photos if applicable:</p>
                <label className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-sm text-gray-500 block cursor-pointer">
                  <span className="text-[#e62245]">Choose file</span> or drop
                  here
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                {formData.files.length > 0 && (
                  <p className="text-sm mt-2">
                    {formData.files.length} file(s) selected
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#e62245] text-white px-7 py-2 rounded hover:bg-[#d41d3f] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Please fill in the form, together with your surveying instrument
              details, and we will reply with an estimate. For queries please{" "}
              <Link to="/contact-us" className="text-[#e62245] underline">
                contact us...
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              This site is protected by reCAPTCHA and the Google{" "}
              <Link to="/ts/privacy" className="text-[#e62245] underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/ts/terms" className="text-[#e62245] underline">
                Terms of Service
              </Link>{" "}
              apply.
            </p>
          </div>
        </form>
      </div>
      <img
        src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-support-page.jpg"
        alt=""
        className="rounded"
      />
    </div>
  );
};

export default SupportRequestForm;
