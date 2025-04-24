import { Link } from "react-router-dom";
import { useState } from "react";

const Service = () => {
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
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

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: e.target.files,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data to be submitted:", formData);
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/Service" className="text-[#e62245]">
          Service
        </Link>
      </div>
      <p className="text-[#e62245] uppercase text-3xl mt-1 mb-6">Service</p>
      <h1 className="text-lg mt-2 text-[#e62245] mb-2 font-bold">
        Surveying Equipment Service, Calibration & Repairs
      </h1>
      {/* Service Description */}
      <div className="text-gray-700 space-y-4 mb-8">
        <p>
          At G2 Survey, we understand that the precision of your project relies
          heavily on the accuracy of your surveying equipment. As a fully
          authorised service partner of Leica Geosystems, we provide top-notch
          service, calibration, and repair solutions for a wide range of survey
          equipment.
        </p>
        <p>
          Our state-of-the-art facility specialises in servicing Total Stations,
          replete with the latest high-precision collimation and tooling,
          ensuring your instruments receive the best care possible.
        </p>
        <p>
          Rest assured, all works within the G2 facility are executed in a
          controlled environment by our Leica certified technicians. Our
          comprehensive stock of spare parts ensures swift, efficient service,
          reducing downtime and getting your instruments back into the field as
          soon as possible.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[1, 2, 3, 4].map((index) => (
          <div key={index}>
            <img
              src={`https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/brand-leica-adsp-l.jpg`}
              alt="Leica Authorized Distributor & Service Partner"
            />
          </div>
        ))}
      </div>
      <div className="space-y-4 mb-8">
        <p>
          In terms of cost, we strive to offer competitive pricing for our
          services. While prices can vary depending on the service and type of
          instrument, we ensure transparency at all stages—see standard service
          pricelist below.
        </p>
        <p>
          G2 Survey isn't just a local service—our reputation extends far and
          wide. We're proud to offer our calibration and repair services to both
          national and international clients, ensuring high-quality,
          precision-based service to all.
        </p>
        <p>
          Our preventative maintenance program is a key part of our offering.
          Regularly scheduled maintenance can extend the life of your equipment,
          prevent costly damages, and ensure the accuracy of your survey
          results.
        </p>
        <p>
          At G2 Survey, we believe in more than just providing a service. We're
          committed to forming lasting partnerships with our clients, based on
          trust, quality, and unrivalled expertise in the surveying sector.
          Reach out to us today and experience the G2 difference.
        </p>
      </div>
      <div className="space-y-6 mb-12">
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-service-page-workshop.jpg"
          alt="Service Center"
          className="w-full rounded-lg"
        />
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-service-page-workshop.jpg"
          alt="Service Center"
          className="w-full rounded-lg"
        />
      </div>
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Service Enquiry Form</h2>
        <p className="mb-6">
          Please fill in the form, together with your survey instrument details,{" "}
          <br />
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
              className="w-full border p-3"
              name="equipment"
              value={formData.equipment}
              onChange={handleInputChange}
            >
              <option value="">Select Equipment</option>
              <option value="Leica">Leica</option>
              <option value="Radiodetection">Radiodetection</option>
              <option value="Trimble">Trimble</option>
              <option value="Topcon">Topcon</option>
              <option value="Sokkia">Sokkia</option>
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
                    className="mr-2 w-4 h-4 text-[#e62245] accent-[#e62245] border-gray-300 rounded focus:ring-[#e62245]"
                    checked={formData.requests[label.toLowerCase()]}
                    onChange={handleCheckboxChange}
                  />
                  {label}
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
    </div>
  );
};

export default Service;
