import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const WeProvide = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data = [] } = useQuery({
    queryKey: ["weProvide"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/we-provide");
      return res.data;
    },
  });

  return (
    <div className="py-5 md:py-16 bg-white">
      <div className="max-w-[1370px] mx-auto px-3 md:px-4">
        <div className="flex items-center justify-center gap-4 mb-7 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            WE PROVIDE
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
          {data?.map((service, index) => (
            <div
              key={service.id || index}
              className="p-4 md:p-8 border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={`${import.meta.env.VITE_OPEN_APIURL}${service.image}`}
                className="w-16 md:w-20 mx-auto"
                alt="WE PROVIDE"
              />
              <h3 className="text-2xl text-black font-bold mb-2">
                {service.title}
              </h3>
              {(service.description || []).map((line, i) => (
                <p key={i} className="text-gray-600">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WeProvide;
