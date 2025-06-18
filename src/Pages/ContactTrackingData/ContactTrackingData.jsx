import { useState } from "react";
import { CiHome } from "react-icons/ci";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ContactTrackingData = () => {
  const axiosPublicUrl = useAxiospublic();
  const [formData, setFormData] = useState({
    mobileNumber: "",
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

    try {
      const res = await axiosPublicUrl.get(
        `/api/clients/search?mobileNumber=${encodeURIComponent(
          formData.mobileNumber
        )}`
      );
      if (res.status === 200 && res.data.length > 0) {
        setResult(res.data[0]);
      } else {
        setResult(null);
        setError("No matching client found.");
      }
    } catch (err) {
      console.log(err);

      setError("Error fetching client information.");
    } finally {
      setSearching(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
        / <span className="text-red-600 font-medium">Client Info</span>
      </div>
      <h1 className="text-[28px] mt-2 text-[#e62245] mb-4 uppercase">
        {"Client Info Data"}
      </h1>

      <div className="text-center mb-6">
        <div className="text-sm text-gray-700 max-w-4xl mx-auto">
          Client Info Data allows you to quickly search and view client details
          by mobile number, displaying company, owner, address, and contact
          information in a clear, user-friendly table format.
        </div>
      </div>

      <hr className="my-8 border-gray-300" />
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-2">{"Client Information"}</h2>
        <p className="text-gray-600 text-sm mb-6">
          {"Search for client info by mobile number."}
        </p>
        <div className="max-w-3xl w-full mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mobileNumber: e.target.value,
                }))
              }
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
            />

            <button
              type="submit"
              className="bg-[#e62245] text-white px-6 py-2 rounded w-full md:w-auto"
              disabled={searching}
            >
              {searching ? "SEARCHING..." : "SUBMIT"}
            </button>
          </form>
          {error && <div className="text-crimson-red mt-2">{error}</div>}
        </div>
        {result && (
          <div className="flex justify-center max-w-3xl w-full mx-auto mt-5">
            <table className="border-collapse border border-crimson-red bg-[#28506a] min-w-[700px] w-full text-left">
              <thead className="text-[#e62245] ">
                <tr>
                  <th className="px-4 py-2 font-semibold">Company Name</th>
                  <th className="px-4 py-2 font-semibold">Owner Name</th>
                  <th className="px-4 py-2 font-semibold">Mobile Number</th>
                  <th className="px-4 py-2 font-semibold">Address</th>
                </tr>
              </thead>
              <tbody className="text-[#fff] border border-crimson-red">
                <tr>
                  <td className="px-4 py-2 ">{result.companyName}</td>
                  <td className="px-4 py-2 ">{result.ownerName}</td>
                  <td className="px-4 py-2 ">{result.mobileNumber}</td>
                  <td className="px-4 py-2 ">{result.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactTrackingData;
