import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaFileAlt } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import { ComponentLoader } from "../../utils/Loader/ComponentLoader";
import { SkeletonLoader } from "../../utils/Loader/SkeletonLoader";

const Hire = () => {
  const formRef = useRef(null);
  const axiosPublicUrl = useAxiospublic();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    existingCustomer: "",
    equipment: [],
    hireDate: "",
    hirePeriod: "",
    comments: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    data: hireContent,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hireContent"],
    queryFn: async () => {
      const { data } = await axiosPublicUrl.get("/api/hire");
      return data.data;
    },
  });

  if (isError) {
    return <p>Error loading data...</p>;
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          equipment: [...prev.equipment, value],
        };
      } else {
        return {
          ...prev,
          equipment: prev.equipment.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      existingCustomer: formData.existingCustomer,
      equipment: formData.equipment,
      hireDate: formData.hireDate,
      hirePeriod: formData.hirePeriod,
      comments: formData.comments,
    };

    try {
      const response = await axiosPublicUrl.post("/api/hire", submissionData);

      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: response.data?.message,
          icon: "success",
          timer: 4000,
          showConfirmButton: false,
        });

        // Reset form
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          existingCustomer: "",
          equipment: [],
          hireDate: "",
          hirePeriod: "",
          comments: "",
        });
      } else {
        Swal.fire("Error", "Failed to submit hire enquiry", "error");
      }
    } catch (error) {
      console.error("Error submitting hire enquiry:", error);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "An unknown error occurred.",
        icon: "error",
        timer: 4000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-3">
        <Link to="/" className="text-[#e62245] hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/hire" className="capitalize text-[#e62245]">
          Hire
        </Link>
      </div>
      <h1 className="text-[28px] font-light text-[#e62245] mb-[72px]">HIRE</h1>
      <div className="flex flex-row justify-center gap-2 md:gap-0 md:justify-between mb-5">
        {isLoading ? (
          <ComponentLoader componentName="MainBanner" />
        ) : (
          hireContent?.show_hire_enquiry_button && (
            <button
              onClick={() =>
                formRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="md:ml-56 cursor-pointer bg-[#e62245] flex items-center gap-2 text-white px-2 md:px-[18.5px] md:py-[7.66667px] rounded-[4px] shadow-xl hover:bg-[#c81e3c] transition-all text-[13px] font-medium"
            >
              <FaRegFileLines />
              Hire Enquiry
            </button>
          )
        )}
        {isLoading ? (
          <ComponentLoader componentName="MainBanner" />
        ) : (
          hireContent?.show_credit_account_button && (
            <Link
              to="/hire/credit-account-application"
              className="md:mr-40 bg-[#e62245] flex items-center gap-2 text-white px-2 md:px-[18.5px] py-[7.66667px] rounded-[4px] shadow-xl hover:bg-[#c81e3c] transition-all text-[13px] font-medium"
            >
              <FaFileAlt />
              Credit Account Application
            </Link>
          )
        )}
      </div>
      <div className="space-y-6 text-gray-700 border-t pt-4 border-gray-200">
        <h2 className="text-sm font-bold">{hireContent?.title}</h2>
        <div
          className="text-sm font-normal"
          dangerouslySetInnerHTML={{ __html: hireContent?.description }}
        ></div>
      </div>
      {hireContent?.show_info_box && (
        <div
          className="bg-[#ebedf1] mt-12 text-sm font-normal p-8 text-center rounded-lg"
          dangerouslySetInnerHTML={{ __html: hireContent?.infoBox }}
        ></div>
      )}
      <div ref={formRef} className="max-w-3xl mx-auto my-12">
        <h2 className="text-3xl font-semibold mb-2">Hire Enquiry Form</h2>
        <p className="mb-6 text-sm">
          Please fill in the form, together with your any specific requirements,
          and we will reply with a customized quote. For queries please{" "}
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
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Phone *
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Existing Credit Account Customer? *</p>
            <div className="flex gap-12">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="existingCustomer"
                  value="yes"
                  checked={formData.existingCustomer === "yes"}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="existingCustomer"
                  value="no"
                  checked={formData.existingCustomer === "no"}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Hire Requirements</h2>
            <p className="font-medium mb-4">Equipment Required *</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "3D Laser Scanner",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/31e0368d-e9d3-436c-aae2-2d1c414b1a4a/leica-rtc360-lt-3d-laser-scanner.jpg",
                },
                {
                  name: "Total Station - Robotic",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/cd5639b5-4de0-452f-97d5-5fdf0c8100ea/leica-ts16-total-station.jpg",
                },
                {
                  name: "Total Station - Manual",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/85909d14-f8cf-4889-bdad-0a07c196f802/leica-ts07-total-station-a.jpg",
                },
                {
                  name: "GPS/GNSS System",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/78006320-aead-4272-98c6-3b730ffb4ce9/leica-gs18t-gnss-smart-antenna-a.jpg",
                },
                {
                  name: "Laser Level",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/1e1a13db-8795-4431-8bd3-49d3dd17eff1/leica-rugby-620-rotating-laser.webp",
                },
                {
                  name: "Pipe Laser",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/02c64108-0c59-41ec-8d10-d301f49963c5/leica-piper-100.jpg",
                },
                {
                  name: "Digital Level",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/6b572d33-bd8e-4895-999e-05f4a27305dc/leica-ls10-digital-level.jpg",
                },
                {
                  name: "Automatic Level",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/42c11b8a-e2a2-487a-9dce-57db93fc344b/leica-na720-automatic-level.jpg",
                },
                {
                  name: "CAT / Genny",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/5a885e6f-ff75-47ce-a104-2e6903ba68e8/radiodetection-gcat4-a.jpg",
                },
                {
                  name: "Precision Locator",
                  image:
                    "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/d255d252-4021-49e6-8d8f-f3bed81630ec/radiodetection-rd8200-b.jpg",
                },
                {
                  name: "Ground Penetrating Radar",
                  image:
                    "https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/7f0eff3b-1f71-4888-be58-db375673176e/leica-dsx-utility-detection-radar.jpg",
                },
                {
                  name: "Other - Specify below",
                  image:
                    "https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/39af9544-93df-4cc0-896f-4ad2fde18cd9/vivax-metrotech-vcam-mx-2-inspection-system.jpg",
                },
              ].map((equipment, index) => (
                <label key={index} className="relative cursor-pointer group">
                  <input
                    type="checkbox"
                    name="equipment"
                    value={equipment.name}
                    checked={formData.equipment.includes(equipment.name)}
                    onChange={handleCheckboxChange}
                    className="hidden"
                  />
                  <div className="border-2 border-[#dcdcdc] rounded-lg p-2 transition-all group-has-[:checked]:border-[#e62245]">
                    <div className="relative">
                      <img
                        src={equipment.image}
                        alt={equipment.name}
                        className="w-full aspect-square object-contain mb-2"
                      />
                      <div className="absolute top-2 right-2 w-5 h-5 border-2 border-gray-400 rounded group-has-[:checked]:border-[#e62245] group-has-[:checked]:bg-[#e62245] group-hover:bg-gray-300 bg-[#e7e7e7] transition-colors flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-center">{equipment.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-800">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-6 items-start">
                {/* Hire Start Date - Left Side */}
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="hireDate"
                    className="block text-[15px] font-normal mb-1"
                  >
                    Hire Start Date <span className="text-red-500">*</span>
                  </label>
                  <div
                    className="relative"
                    onClick={() =>
                      document.getElementById("hireDate").showPicker()
                    }
                  >
                    <input
                      type="date"
                      id="hireDate"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#e62245] focus:border-transparent bg-white cursor-pointer"
                      required
                      style={{
                        colorScheme: "light",
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Hire Period - Right Side */}
                <div className="w-full sm:w-2/3">
                  <label className="block text-[15px] font-normal mb-2">
                    Hire Period (approx) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["1 Week", "2 Weeks", "Long Term Hire", "Not Sure..."].map(
                      (label, i) => (
                        <label
                          key={i}
                          className="inline-flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="hirePeriod"
                            value={label}
                            checked={formData.hirePeriod === label}
                            onChange={handleInputChange}
                            className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                          />
                          <span>{label}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  name="comments"
                  id="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="peer w-full border border-gray-300 p-2 pt-5 h-32 rounded placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245]"
                  placeholder="Special Instructions/Requirements"
                ></textarea>
                <label
                  htmlFor="comments"
                  className="absolute left-2 top-2 text-gray-500 text-sm transition-all 
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
      peer-placeholder-shown:text-gray-400 peer-focus:top-2 
      peer-focus:text-xs peer-focus:text-black"
                >
                  Special Instructions/Requirements
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#e62245] text-white px-[29px] py-[7px] rounded hover:bg-[#e62225] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
            <p className="text-[13px] text-gray-500 mt-4">
              Please fill in the form, together with your surveying instrument
              details, and we will reply with an estimate. For queries please{" "}
              <Link
                to={hireContent?.links?.contactUs || "/contact-us"}
                className="text-[#e62245] underline"
              >
                contact us...
              </Link>
            </p>
            <p className="text-[13px] text-gray-500">
              This site is protected by reCAPTCHA and the Google{" "}
              <Link
                to={hireContent?.links?.privacyPolicy || "/ts/privacy"}
                className="text-[#e62245] underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to={hireContent?.links?.termsOfService || "/ts/terms"}
                className="text-[#e62245] underline"
              >
                Terms of Service
              </Link>{" "}
              apply.
            </p>
          </div>
        </form>
      </div>
      {isLoading ? (
        <SkeletonLoader className="w-full h-64 mt-8" />
      ) : (
        hireContent?.imageUrl && (
          <img
            src={`${import.meta.env.VITE_OPEN_APIURL}${hireContent?.imageUrl}`}
            alt="Hire Banner"
            className="max-w-full h-auto mt-8 rounded"
          />
        )
      )}
    </div>
  );
};

export default Hire;
