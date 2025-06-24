import { useState } from "react";
import { CiHome } from "react-icons/ci";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const CertificateTracking = () => {
  const axiosPublicUrl = useAxiospublic();
  const [formData, setFormData] = useState({
    trackingNumber: "",
    serialNumber: "",
  });
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const { data: certificateData, isLoading } = useDataQuery(
    ["certificateDescription"],
    "/api/certificate-description"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setSearching(true);

    if (!formData.trackingNumber.trim() || !formData.serialNumber.trim()) {
      setError("Tracking Number and Serial Number are required.");
      setSearching(false);
      return;
    }

    try {
      const res = await axiosPublicUrl.get(
        `/api/equipments/search?trackingNo=${encodeURIComponent(
          formData.trackingNumber
        )}&serialNo=${encodeURIComponent(formData.serialNumber)}`
      );
      // console.log(res.data);
      if (res.status === 200) {
        setResult(res.data[0]);
      } else {
        setResult(null);
        setError("No matching equipment found.");
      }
    } catch (err) {
      console.log(err);
      setError("Error fetching equipment information.");
    } finally {
      setSearching(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto p-4 md:p-5">
      <div className="flex items-center gap-2 text-[11px] mb-2 text-gray-500">
        <Link to="/" className="flex items-center gap-1">
          <CiHome className="text-base" /> Home
        </Link>
        /{" "}
        <Link to="/support" className="font-medium">
          Support
        </Link>{" "}
        / <span className="text-red-600 font-medium">Certificate Tracking</span>
      </div>
      <h1 className="text-xl sm:text-[28px] mt-2 text-[#e62245] mb-4 uppercase">
        {certificateData?.title || "Certificate Tracking"}
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
        <h2 className="text-2xl font-semibold mb-2">
          {certificateData?.tracking_title || "Tracking Information"}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {certificateData?.tracking_description || ""}
        </p>
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col md:flex-row justify-center gap-4 `}
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
                setFormData((prev) => ({
                  ...prev,
                  serialNumber: e.target.value,
                }))
              }
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
            />

            <button
              type="submit"
              className="bg-[#e62245] cursor-pointer text-white px-6 py-2 rounded w-full md:w-auto"
              disabled={searching}
            >
              {searching ? "SEARCHING..." : "SUBMIT"}
            </button>
          </form>
          {error && <div className="text-crimson-red mt-2">{error}</div>}
        </div>
        {result && (
          <div className="flex justify-center max-w-7xl mx-auto mt-5">
            <div className="overflow-x-auto">
              <table className="border-collapse border text-left shadow-lg rounded-md overflow-hidden bg-white">
                <thead className="text-crimson-red bg-gray-100">
                  <tr>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Tracking No
                    </th>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Equipment
                    </th>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Serial Number
                    </th>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Accuracy
                    </th>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Manufacturer
                    </th>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Company Name
                    </th>
                    <th className="px-2 md:px-4 py-3 font-semibold">
                      Validity
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black border">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 md:px-4 py-3">{result.trackingNo}</td>
                    <td className="px-2 md:px-4 py-3">{result.equipment}</td>
                    <td className="px-2 md:px-4 py-3">{result.serialNo}</td>
                    <td className="px-2 md:px-4 py-3">{result.accuracy}</td>
                    <td className="px-2 md:px-4 py-3">{result.manufacturer}</td>
                    <td className="px-2 md:px-4 py-3">{result.companyName}</td>
                    <td className="px-2 md:px-4 py-3">
                      {result.validity
                        ? new Date(result.validity).toISOString().slice(0, 10)
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center my-8">
        {certificateData?.image_url && (
          <img
            src={`${import.meta.env.VITE_OPEN_APIURL}${
              certificateData.image_url
            }`}
            alt="Certificate Equipment"
            className="rounded max-w-4xl w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CertificateTracking;
