import { FaCheckCircle } from "react-icons/fa";

const services = [
  {
    title: "Certified Service Engineer Of KOLIDA",
    description:
      "TS Geosystems Bangladesh has a factory-trained certified service engineer of Kolida Instrument.",
  },
  {
    title: "Authorized Distributor GEOMAX",
    description:
      "TS Geosystems Bangladesh is the authorized distributor of Geomax in Bangladesh.",
  },
  {
    title: "Certified Service Engineer Of Leica",
    description:
      "TS Geosystems Bangladesh has a factory-trained certified service engineer of Leica Geosystems.",
  },
  {
    title: "Authorized Distributor Kolida",
    description:
      "TS Geosystems Bangladesh is the authorized distributor of Kolida in Bangladesh.",
  },
  {
    title: "Loan facilities",
    description:
      "TS Geosystems Bangladesh provides loan facilities when purchasing new equipment.",
  },
  {
    title: "Wide range of equipment",
    description:
      "TS Geosystems always maintain wide range of brand & model surveying equipment.",
  },
  {
    title: "ISO Certified Calibration Equipment",
    description:
      "All of our surveying equipment service & calibrated by ISO certified equipment.",
  },
  {
    title: "Tranning & Support",
    description:
      "TS Geosystems provides training facilities with new equipment & any support that our valuable clients need.",
  },
];

const OurAdServices = () => {
  return (
    <div className="py-7 md:py-16 px-4">
      <div className="max-w-[1300px] mx-auto">
        {/* Title */}
        <div className="flex items-center justify-center gap-1 md:gap-4 mb-6 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] text-center">
            OUR ADVANTAGE & SERVICES
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 md:p-5 flex gap-2 md:gap-4 items-start"
            >
              <FaCheckCircle className="text-[#61b961] text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-[#020202]">
                  {item.title}
                </h3>
                <p className="text-[#020202] mt-1 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurAdServices;
