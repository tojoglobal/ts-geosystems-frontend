import { BsBriefcaseFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
const OurAchievements = () => {
  return (
    <div className="max-w-[1370px] text-black mx-auto px-3 py-6 md:py-12">
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
        <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap uppercase">
          OUR ACHIEVEMENTS
        </h2>
        <div className="flex-1 h-0.5 bg-[#e62245]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        <div className="p-8 rounded-lg border shadow-sm md:shadow-md text-center">
          <div className="flex justify-center mb-4">
            <BsBriefcaseFill className="w-16 h-16 text-teal-500" />
          </div>
          <h3 className="text-4xl font-bold mb-2">11+</h3>
          <p className="uppercase font-medium">YEARS EXPERIENCE</p>
        </div>
        <div className="p-8 rounded-lg border shadow-sm md:shadow-md text-center">
          <div className="flex justify-center mb-4">
            <FaUsers className="w-16 h-16 text-teal-500" />
          </div>
          <h3 className="text-4xl font-bold mb-2">1126+</h3>
          <p className="uppercase font-medium">VALUABLE CLIENTS</p>
        </div>
        <div className="p-8 rounded-lg border shadow-sm md:shadow-md text-center">
          <div className="flex justify-center mb-4">
            <FiSettings className="w-16 h-16 text-teal-500" />
          </div>
          <h3 className="text-4xl font-bold mb-2">4099+</h3>
          <p className="uppercase font-medium">CALIBRATION</p>
        </div>
      </div>
    </div>
  );
};

export default OurAchievements;
