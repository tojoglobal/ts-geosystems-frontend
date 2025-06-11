import { useQuery } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const OurAdServices = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data = {} } = useQuery({
    queryKey: ["ourAdServices"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/our-ad-services");
      return res.data;
    },
  });
  const { section_title, items = [] } = data;

  return (
    <div className="py-7 md:py-16 px-3 md:px-4">
      <div className="w-full max-w-[95%] 2xl:max-w-[1370px] mx-auto">
        {/* Title */}
        <div className="flex items-center justify-center gap-1 md:gap-4 mb-6 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] text-center">
            {section_title}
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items?.map((item, index) => (
            <div
              key={item.id || index}
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
