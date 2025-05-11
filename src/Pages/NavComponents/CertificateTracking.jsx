import { useState } from "react";
import { CiHome } from "react-icons/ci";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";

const CertificateTracking = () => {
  const [formData, setFormData] = useState({
    trackingNumber: "",
    serialNumber: "",
  });

  const { data: certificateData, isLoading } = useDataQuery(
    ["certificateDescription"],
    "/api/certificate-description"
  );
  console.log(certificateData);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[1370px] mx-auto p-5">
      <div className="flex items-center gap-2 text-[11px] mb-2 text-gray-500">
        <Link to="/" className="flex items-center gap-1">
          <CiHome className="text-base" /> Home
        </Link>
        / <span className="text-red-600 font-medium">Support</span> /{" "}
        <span className="text-red-600 font-medium">Certificate Tracking</span>
      </div>
      <h1 className="text-[30px] font-bold text-red-600 mb-4 uppercase">
        Certificate Tracking
      </h1>
      {certificateData?.description && (
        <div className="text-center mb-6">
          <div
            className="text-sm text-gray-700 max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: certificateData.description }}
          />
        </div>
      )}
      <hr className="my-8 border-gray-300" />
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-2">Tracking Information</h2>
        <p className="text-gray-600 text-sm mb-6">
          Tracking information of your Total Station, Auto Level, Digital Level,
          Theodolite, RTK
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row justify-center gap-1 max-w-5xl mx-auto"
        >
          <input
            type="text"
            name="trackingNumber"
            placeholder="Tracking Number"
            value={formData.trackingNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                trackingNumber: e.target.value,
              }))
            }
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          />
          <input
            type="text"
            name="serialNumber"
            placeholder="Equipment Serial Number"
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, serialNumber: e.target.value }))
            }
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          />
          <button
            type="submit"
            className="bg-[#e62245] text-white px-6 py-2 rounded w-full md:w-auto"
          >
            SUBMIT
          </button>
        </form>
      </div>
      <div className="flex justify-center my-8">
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-hire-page-a.jpg"
          alt="Certificate Equipment"
          className="rounded max-w-4xl w-full"
        />
      </div>
    </div>
  );
};

export default CertificateTracking;
