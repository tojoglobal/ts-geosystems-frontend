import useDataQuery from "../../../utils/useDataQuery";
const GadgetGoHighBanner = () => {
  const { data = [], isLoading } = useDataQuery(
    ["homepageSingleImages"],
    "/api/get-homepage-single-images"
  );
  if (isLoading) return null;
  return (
    <div className="md:w-full my-3 md:my-5 mx-3 max-w-[1370px] md:mx-auto">
      <div className="flex h-96 md:h-72 w-full flex-col md:flex-row gap-3 md:gap-4">
        <div className="w-full md:w-[33%] overflow-hidden rounded-md group">
          <img
            src={`${import.meta.env.VITE_OPEN_APIURL}${
              data?.data[1]?.imageUrl
            }`}
            alt="feature_highlight_banner_04_left_01"
            className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="w-full md:w-[67%] md:relative group overflow-hidden rounded-md">
          <img
            src={`${import.meta.env.VITE_OPEN_APIURL}${
              data?.data[2]?.imageUrl
            }`}
            alt="feature_highlight_banner_04_right_02"
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default GadgetGoHighBanner;
