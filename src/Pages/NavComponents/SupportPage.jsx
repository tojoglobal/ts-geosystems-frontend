import { Link } from "react-router-dom";
import { useState } from "react";

const SupportPage = () => {
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
    const submissionData = {
      contactDetails: {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
      },
      equipmentDetails: {
        type: formData.equipment,
        model: formData.model,
      },
      supportRequest: {
        issues: formData.supportIssues,
        details: formData.details,
        attachments: formData.files.length > 0 ? "Files attached" : "No files",
      },
    };
    console.log(submissionData);

    try {
      // logic here
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="text-[#e62245]">
          Support
        </Link>
      </div>
      <h1 className="text-3xl mt-2 text-[#e62245] mb-6">SUPPORT</h1>
      <div className="flex flex-col items-center text-center md:flex-row md:justify-center gap-2 md:gap-8 text-sm font-medium text-[#e62245] mb-12">
        <Link to="/software-downloads">SOFTWARE DOWNLOADS</Link>
        <Link to="/remote-support">QUICK GUIDES</Link>
        <Link to="/user-manuals">USER MANUALS</Link>
        <Link to="/remote-support">REMOTE SUPPORT</Link>
      </div>
      <div className="max-w-4xl mx-auto relative bg-gradient-to-b from-[#f4f5f9] to-[#e6e7ec] rounded-md p-3 mb-6">
        <div className="absolute -top-3 md:-top-4 right-4 md:right-11 text-[#e62245] text-base md:text-lg">
          <Link to="/cc">Certificate Tracking</Link>
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-4">
          <Link
            to="/software-downloads"
            className="bg-[#e62245] text-sm md:text-base text-white px-2 md:px-4 py-2 rounded text-center"
          >
            Software Downloads
          </Link>
          <Link
            to="/remote-support"
            className="bg-[#e62245] text-sm md:text-base text-white px-2 md:px-4 py-2 rounded text-center"
          >
            Remote Support
          </Link>
          <Link
            to="/quick-guides"
            className="bg-[#e62245] text-sm md:text-base text-white px-2 md:px-4 py-2 rounded text-center"
          >
            Quick Guides
          </Link>
          <Link
            to="/user-manuals"
            className="bg-[#e62245] text-sm md:text-base text-white px-2 md:px-4 py-2 rounded text-center"
          >
            User Manuals
          </Link>
          <Link
            to="/leica"
            className="bg-[#e62245] text-sm md:text-base text-white px-2 md:px-4 py-2 rounded text-center"
          >
            Leica MyWorld
          </Link>
        </div>
      </div>
      <div className="border-b pb-5 text-sm text-gray-700 text-center space-y-2">
        <p>
          G2 Survey will always make every effort to offer the full solution for
          our clients. It's not enough to just hire or sell surveying equipment
          and send you on your way.
        </p>
        <p>
          Our technical support team has over 100 years of combined experience,
          so whether it takes a simple phone call, remote active assistance, or
          site visits, we are here to provide world class support.
        </p>
      </div>
      <div className="max-w-3xl mx-auto my-6">
        <h2 className="text-2xl font-semibold mb-2">Support Request Form</h2>
        <p className="mb-6">
          Please fill in the form, together with your survey instrument details,
          <br />
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
                <select
                  className="w-full border p-3 appearance-none focus:outline-none focus:ring focus:ring-[#e62245]"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""></option>
                  <option value="Leica HDS">Leica HDS</option>
                  <option value="Leica TPS">Leica TPS</option>
                  <option value="Leica GPS">Leica GPS</option>
                  <option value="Leica Construction">Leica Construction</option>
                  <option value="Other">Other</option>
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
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={label}
                        checked={formData.supportIssues.includes(label)}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 bg-gray-200 accent-[#e62245] rounded"
                      />
                      <span>{label}</span>
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
      <img
        src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-support-page.jpg"
        alt=""
      />
    </div>
  );
};

export default SupportPage;
