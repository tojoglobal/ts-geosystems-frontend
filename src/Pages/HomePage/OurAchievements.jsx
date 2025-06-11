import { useQuery } from "@tanstack/react-query";
import { BsBriefcaseFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import CountUp from "react-countup";
import { InView } from "react-intersection-observer";

const iconMap = [BsBriefcaseFill, FaUsers, FiSettings];

const OurAchievements = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data = {}, isLoading } = useQuery({
    queryKey: ["ourAchievements"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/our-achievements");
      return res.data;
    },
  });
  const { section_title, items = [] } = data;
  if (isLoading) return null;

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] text-black mx-auto px-3 py-6 md:py-12">
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
        <div className="flex-1 h-0.5 bg-[#e62245]" />
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap uppercase">
          {section_title}
        </h2>
        <div className="flex-1 h-0.5 bg-[#e62245]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {items?.map((item, idx) => {
          const Icon = iconMap[idx] || iconMap[0];
          const rawNumber = item.number;
          const numericPart = parseInt(rawNumber, 10);
          const hasPlus = rawNumber?.includes("+");

          return (
            <InView triggerOnce={true} key={item.id || idx}>
              {({ inView, ref }) => (
                <div
                  ref={ref}
                  className="p-8 rounded-lg border shadow-sm md:shadow-md text-center"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="w-10 md:w-16 h-10 md:h-16 text-teal-500" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-2">
                    {!isNaN(numericPart) ? (
                      <div className="text-5xl font-normal">
                        {inView ? (
                          <CountUp
                            start={0}
                            end={numericPart}
                            duration={3}
                            separator=","
                          />
                        ) : (
                          0
                        )}
                        {hasPlus && "+"}
                      </div>
                    ) : (
                      rawNumber
                    )}
                  </h3>
                  <p className="uppercase font-medium">{item.text}</p>
                </div>
              )}
            </InView>
          );
        })}
      </div>
    </div>
  );
};

export default OurAchievements;
