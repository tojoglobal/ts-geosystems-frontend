import useDataQuery from "../../../utils/useDataQuery";
const GadgetGoHighBanner = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["homepageSingleImages"],
    "/api/get-homepage-single-images"
  );
  const left = data?.data?.[1];
  const right = data?.data?.[2];

  // Optionally, show a skeleton loader here
  if (isLoading)
    return (
      <div className="md:w-full my-3 md:my-5 mx-3 max-w-[1370px] md:mx-auto">
        <div className="flex h-96 md:h-72 w-full flex-col md:flex-row gap-3 md:gap-4">
          <div className="w-full md:w-[33%] h-full bg-gray-200 animate-pulse rounded-md" />
          <div className="w-full md:w-[67%] h-full bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    );

  return (
    <div className="md:w-full my-3 md:my-5 mx-3 max-w-[1370px] md:mx-auto">
      <div className="flex h-80 md:h-72 w-full flex-col md:flex-row gap-3 md:gap-4">
        <div className="w-full md:w-[33%] overflow-hidden rounded-md group h-full">
          {left?.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}${left.imageUrl}`}
              alt={left?.uniqueName || "feature_highlight_banner_04_left_01"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="w-full md:w-[67%] md:relative group overflow-hidden rounded-md h-full">
          {right?.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}${right.imageUrl}`}
              alt={right?.uniqueName || "feature_highlight_banner_04_right_02"}
              className="w-full md:h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GadgetGoHighBanner;
