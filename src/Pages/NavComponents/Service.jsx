import { Link } from "react-router-dom";

const Service = () => {
  return (
    <div className="p-3">
      {/* Breadcrumb */}
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
          G2 Survey isn’t just a local service—our reputation extends far and
          wide. We’re proud to offer our calibration and repair services to both
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
      {/* Service Enquiry Form */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Service Enquiry Form</h2>
        <p className="mb-6">
          Please fill in the form, togther with your survey instrument details,{" "}
          <br />
          and we will reply with a estimate. For queries please{" "}
          <Link to="/contact-us" className="text-[#e62245] underline">
            contact us...
          </Link>
        </p>
        <form className="space-y-6">
          <p className="text-lg font-semibold">Contact Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                className="w-full border p-2 placeholder-black"
                placeholder="Name *"
                required
              />
            </div>
            <div>
              <input
                type="text"
                className="w-full border p-2 placeholder-black"
                placeholder="Company Name *"
                required
              />
            </div>
            <div>
              <input
                type="email"
                className="w-full border p-2 placeholder-black"
                placeholder="Email *"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                className="w-full border p-2 placeholder-black"
                placeholder="Phone *"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-5">
              Surveying Equipment Details
            </label>
            <select className="w-full border p-2">
              <option value="">Select Equipment</option>
              <option value="Leica">Leica</option>
              <option value="Radiodetection">Radiodetection</option>
              <option value="Trimble">Trimble</option>
              <option value="Topcon">Topcon</option>
              <option value="Sokkia">Sokkia</option>
            </select>
          </div>
          <div>
            <input
              type="tel"
              className="w-full border p-2 placeholder-black"
              placeholder="Instrument Model"
              required
            />
          </div>
          <div className="space-y-4 text-sm text-gray-800">
            {/* Request checkboxes */}
            <div className="space-y-2">
              <p className="font-medium">Request *</p>

              {["Service", "Calibration", "Repair"].map((label) => (
                <label key={label} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-[#e62245] accent-[#e62245] border-gray-300 rounded focus:ring-[#e62245]"
                  />
                  {label}
                </label>
              ))}
            </div>
            {/* Comments Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea className="w-full border border-gray-300 p-2 h-32 rounded"></textarea>
            </div>
            {/* File upload */}
            <div>
              <p className="mb-2">Please attach photos if applicable:</p>
              <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-sm text-gray-500">
                <span className="text-[#e62245]">Choose file</span> or drop here
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
              <Link to="/privacy" className="text-[#e62245] underline">
                Privacy Policy
              </Link>{" "}
              and
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
