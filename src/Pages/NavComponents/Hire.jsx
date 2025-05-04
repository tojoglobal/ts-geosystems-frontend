import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaFileAlt } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const Hire = () => {
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    // you can use error.messgae/add error beside isError in useQuery
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
      contactDetails: {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        existingCustomer: formData.existingCustomer,
      },
      hireRequirements: {
        equipment: formData.equipment,
        hireDate: formData.hireDate,
        hirePeriod: formData.hirePeriod,
        specialInstructions: formData.comments,
      },
    };

    console.log("Submitting data:", JSON.stringify(submissionData, null, 2));

    try {
      // logic
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="text-[#e62245] hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Hire</span>
      </div>
      <h1 className="text-4xl text-[#e62245] mb-8">HIRE</h1>
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between gap-6 mb-5">
        <Link
          to="/hire-enquiry"
          className="bg-[#e62245] flex items-center gap-2 text-white px-6 py-2 rounded-md shadow-md hover:bg-[#c81e3c] transition"
        >
          <FaRegFileLines />
          Hire Enquiry
        </Link>
        <Link
          to="/credit-application"
          className="bg-[#e62245] flex items-center gap-2 text-white px-6 py-2 rounded-md shadow-md hover:bg-[#c81e3c] transition"
        >
          <FaFileAlt />
          Credit Account Application
        </Link>
      </div>
      <div className="space-y-6 text-gray-700 border-t pt-6">
        <h2 className="text-xl font-semibold">{hireContent?.title}</h2>
        <div
          dangerouslySetInnerHTML={{ __html: hireContent?.description }}
        ></div>
      </div>
      <div
        className="bg-[#ebedf1] mt-12 p-8 text-center rounded-lg"
        dangerouslySetInnerHTML={{ __html: hireContent?.infoBox }}
      ></div>
      <div className="max-w-3xl mx-auto my-12">
        <h2 className="text-2xl font-semibold mb-2">Hire Enquiry Form</h2>
        <p className="mb-6">
          Please fill in the form, together with your any specific requirements,
          <br />
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
                Company Name
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
                  className="w-4 h-4 text-[#e62245] border-gray-300 focus:ring-[#e62245]"
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
                  className="w-4 h-4 text-[#e62245] border-gray-300 focus:ring-[#e62245]"
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
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hire Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-[#e62245]"
                    required
                  />
                </div>

                {/* Hire Period - Right Side */}
                <div className="w-full sm:w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="form-radio text-[#e62245] focus:ring-[#e62245]"
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
              <Link to="/privacy" className="text-[#e62245] underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="text-[#e62245] underline">
                Terms of Service
              </Link>{" "}
              apply.
            </p>
          </div>
        </form>
      </div>
      {hireContent.imageUrl && (
        <img
          src={`${import.meta.env.VITE_OPEN_APIURL}${hireContent?.imageUrl}`}
          alt="Hire Banner"
          className="max-w-full h-auto mt-8 rounded"
        />
      )}
    </div>
  );
};

export default Hire;
