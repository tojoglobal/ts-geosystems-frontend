import { Link } from "react-router-dom";
import { useState } from "react";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import { SkeletonLoader } from "../../utils/Loader/SkeletonLoader";

const Service = () => {
  const axiosPublicUrl = useAxiospublic();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    equipment: "",
    model: "",
    requests: {
      service: false,
      calibration: false,
      repair: false,
    },
    comments: "",
    files: null,
  });

  // For showing the current number of files selected
  const [fileCount, setFileCount] = useState(0);
  // For showing a small green "file added" message
  const [fileAddMsg, setFileAddMsg] = useState("");

  const {
    data = {},
    isLoading: contentLoading,
    isError: contentError,
  } = useDataQuery(["serviceContent"], "/api/service");
  const serviceContent = data?.data || [];

  const { data: images = [], isLoading: imagesLoading } = useDataQuery(
    ["serviceImages"],
    "/api/get-service-images"
  );

  const { data: equipment = [], isLoading: optionsLoading } = useDataQuery(
    ["serviceEquipment"],
    "/api/service-equipment-options"
  );
  const equipmentOptions = equipment?.data?.equipment_options || [];
  // Grid and banner image logic as before
  const gridImages = images
    .filter((img) => img.show && [1, 2, 3, 4].includes(img.order))
    .sort((a, b) => a.order - b.order);

  const bannerImages = images
    .filter((img) => img.show && [5, 6].includes(img.order))
    .sort((a, b) => a.order - b.order);

  if (contentError) {
    return <p>Error loading data...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      requests: {
        ...prev.requests,
        [name.toLowerCase()]: checked,
      },
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData((prev) => ({
      ...prev,
      files: files,
    }));
    setFileCount(files.length);
    if (files.length > 0) {
      setFileAddMsg("File(s) added!");
      setTimeout(() => setFileAddMsg(""), 1500);
    } else {
      setFileAddMsg("");
    }
  };

  // Helper: check if required fields are filled
  const isFormValid = () => {
    if (
      !formData.name.trim() ||
      !formData.company.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.model.trim()
    )
      return false;
    // At least one request type must be checked
    if (
      !formData.requests.service &&
      !formData.requests.calibration &&
      !formData.requests.repair
    )
      return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Form incomplete",
        text: "Please fill in all required fields and select at least one request type.",
        timer: 4000,
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "requests") {
        formDataToSend.append("requests", JSON.stringify(value));
      } else if (key === "files" && value) {
        Array.from(value).forEach((file) => {
          formDataToSend.append("files", file);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const res = await axiosPublicUrl.post(
        "/api/service-inquiries",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status === 201) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: res.data?.message,
          timer: 4000,
        });
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          equipment: "",
          model: "",
          requests: {
            service: false,
            calibration: false,
            repair: false,
          },
          comments: "",
          files: null,
        });
        setFileCount(0);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message || "Submission failed",
        text: "Could not submit your inquiry. Please try again.",
        timer: 4000,
      });
    }
  };

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-2">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/Service" className="capitalize text-[#e62245]">
          Service
        </Link>
      </div>
      {contentLoading ? (
        <SkeletonLoader className="h-8 w-32 mb-4" />
      ) : (
        <p className="text-[#e62245] font-light uppercase text-[28px] mt-2 mb-4">
          Service
        </p>
      )}
      {/* Main title */}
      {contentLoading ? (
        <SkeletonLoader className="h-6 w-3/4 mb-2" />
      ) : (
        <h1 className="text-lg mt-2 text-[#e62245] mb-2 font-bold">
          {serviceContent?.title ||
            "Surveying Equipment Service, Calibration & Repairs"}
        </h1>
      )}

      {/* Service Description */}
      {contentLoading ? (
        <div className="space-y-2 mb-8">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-5/6" />
          <SkeletonLoader className="h-4 w-4/5" />
          <SkeletonLoader className="h-4 w-full" />
        </div>
      ) : (
        <div
          className="text-gray-700 space-y-4 text-sm font-normal mb-8"
          dangerouslySetInnerHTML={{ __html: serviceContent?.description }}
        />
      )}
      {/* Grid Images */}
      {imagesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader
              key={i}
              className="w-full h-[230px] md:h-64 rounded-[4px]"
            />
          ))}
        </div>
      ) : (
        gridImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {gridImages.map((image) => (
              <div key={image.order}>
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${image.filePath}`}
                  alt={`Service grid image ${image.order}`}
                  className="w-full h-[230px] md:h-64 rounded-[4px]"
                />
              </div>
            ))}
          </div>
        )
      )}

      {/* Info After Images */}
      {contentLoading ? (
        <div className="space-y-2 mb-8">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-5/6" />
          <SkeletonLoader className="h-4 w-4/5" />
        </div>
      ) : (
        serviceContent?.info_after_images && (
          <div
            className="space-y-4 mb-8 text-sm font-normal"
            dangerouslySetInnerHTML={{
              __html: serviceContent.info_after_images,
            }}
          />
        )
      )}

      {/* Banner Images */}
      {imagesLoading ? (
        <div className="space-y-6 mb-12">
          {[1, 2].map((i) => (
            <SkeletonLoader
              key={i}
              className="w-full h-[230px] md:h-[490px] rounded-sm"
            />
          ))}
        </div>
      ) : (
        bannerImages.length > 0 && (
          <div className="space-y-6 mb-12">
            {bannerImages.map((image) => (
              <img
                key={image.order}
                src={`${import.meta.env.VITE_OPEN_APIURL}${image.filePath}`}
                alt={`Service banner ${image.order}`}
                className="w-full h-[230px] md:h-[490px] rounded-sm"
              />
            ))}
          </div>
        )
      )}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Service Enquiry Form</h2>
        <p className="mb-6 text-sm">
          Please fill in the form, together with your survey instrument details,
          and we will reply with a estimate. For queries please{" "}
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
          <div>
            <label className="block text-lg font-semibold mb-5">
              Surveying Equipment Details
            </label>
            <select
              className="w-full border p-3 appearance-none focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white"
              name="equipment"
              value={formData.equipment}
              onChange={handleInputChange}
            >
              <option value="">Select Equipment</option>
              {optionsLoading ? (
                <option value="" disabled>
                  Loading options...
                </option>
              ) : (
                equipmentOptions?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))
              )}
            </select>
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
              placeholder="Instrument Model"
            />
            <label
              htmlFor="model"
              className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
            >
              Instrument Model *
            </label>
          </div>
          <div className="space-y-4 text-sm text-gray-800">
            {/* Request checkboxes */}
            <div className="space-y-2">
              <p className="font-medium">Request *</p>

              {["Service", "Calibration", "Repair"].map((label) => (
                <label key={label} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={label}
                    className="w-4 h-4 appearance-none bg-[#e7e7e7] border border-gray-300 rounded checked:bg-[#e62245] checked:border-[#e62245] checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')]"
                    checked={formData.requests[label.toLowerCase()]}
                    onChange={handleCheckboxChange}
                  />
                  <span className="text-sm ml-2">{label}</span>
                </label>
              ))}
            </div>
            {/* Comments Textarea */}
            <div className="relative w-full">
              <textarea
                name="comments"
                id="comments"
                className="peer w-full border border-gray-300 p-2 pt-5 h-32 rounded placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245]"
                placeholder="Comments"
                value={formData.comments}
                onChange={handleInputChange}
              ></textarea>
              <label
                htmlFor="comments"
                className="absolute left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Comments
              </label>
            </div>
            {/* File upload */}
            <div>
              <p className="mb-2">Please attach photos if applicable:</p>
              <label className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-sm text-gray-500 block cursor-pointer">
                <span className="text-[#e62245]">Choose file</span> or drop here
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
              {/* Show file count and "file(s) added" message */}
              <div className="mt-2 flex items-center gap-3 min-h-[22px]">
                {fileCount > 0 && (
                  <span className="text-green-700 text-sm">
                    {fileCount} file{fileCount > 1 ? "s" : ""} selected
                  </span>
                )}
                {fileAddMsg && (
                  <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                    {fileAddMsg}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#e62245] text-white px-7 py-2 rounded hover:bg-[#d41d3f] transition-colors"
              >
                Submit
              </button>
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
      {imagesLoading ? (
        <SkeletonLoader className="w-full h-64" />
      ) : (
        <div>
          <img
            src={`${
              import.meta.env.VITE_OPEN_APIURL
            }/uploads/hire/hire-banner-1746352683586.jpg`}
            alt="Service banner"
            className="w-full rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Service;
