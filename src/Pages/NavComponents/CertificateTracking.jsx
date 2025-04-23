import { CiHome } from "react-icons/ci";
import { Link } from "react-router-dom";

const CertificateTracking = () => {
  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex gap-1 text-sm mb-2 text-gray-500">
        <Link to="/" className="flex items-center gap-1">
          <CiHome className="text-base" /> Home
        </Link>
        / <span className="text-red-600 font-medium">Support</span> /{" "}
        <span className="text-red-600 font-medium">Certificate Tracking</span>
      </div>
      <h1 className="text-3xl font-bold text-red-600 mb-4 uppercase">
        Certificate Tracking
      </h1>
      <p className="text-center text-gray-700 mb-1 max-w-3xl mx-auto">
        G2 Survey will always make every effort to offer the full solution for
        our clients. It’s not enough to just hire or sell surveying equipment
        and send you on your way.
      </p>
      <p className="text-center text-gray-700 mb-6 max-w-4xl mx-auto">
        Our technical support team has over 100 years of combined experience, so
        whether it takes a simple phone call, remote active assistance, or site
        visits, we are here to provide world class support.
      </p>
      <hr className="my-8 border-gray-300" />
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-2">Tracking Information</h2>
        <p className="text-gray-600 mb-6">
          Tracking information of your Total Station, Auto Level, Digital Level,
          Theodolite, RTK
        </p>
        <form className="flex flex-col md:flex-row justify-center gap-2 max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="Tacking Number"
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          />
          <input
            type="text"
            placeholder="Equipment Serial Number"
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
      <div className="flex justify-center">
        <img
          src="/images/certificate-equipment.png"
          alt="Certificate Equipment"
          className="rounded max-w-4xl w-full"
        />
      </div>
    </div>
  );
};

export default CertificateTracking;
