import useDataQuery from "../../utils/useDataQuery";
const ExperienceCenter = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["experience_center_images_public"],
    "/api/get-experience-center-images"
  );

  if (isLoading) return null;
  if (data?.data === 0) return null;

  return (
    <div className="py-3 md:py-12 bg-white">
      <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto px-3 md:px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-[#e62245] whitespace-nowrap uppercase">
            Experience Center
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-2 md:gap-4 text-center">
          {data?.data.slice(0, 3).map((image, i) => (
            <div key={i} className="overflow-hidden rounded-md">
              <img
                src={`${import.meta.env.VITE_OPEN_APIURL}${image.photourl}`}
                alt={`Experience Center ${i + 1}`}
                className="w-full h-40 sm:h-32 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCenter;
