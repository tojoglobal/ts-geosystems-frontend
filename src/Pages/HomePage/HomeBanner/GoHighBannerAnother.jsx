import useDataQuery from "../../../utils/useDataQuery";

const GoHighBannerAnother = () => {
  const { data = [], isLoading } = useDataQuery(
    ["homepageSingleImages"],
    "/api/get-homepage-single-images"
  );

  if (isLoading || !data?.data?.[4]?.imageUrl) return null;

  return (
    <div className="mt-6 md:mt-10 w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto px-3 md:px-0 overflow-hidden rounded-md">
      <div className="rounded-md overflow-hidden">
        <img
          src={`${import.meta.env.VITE_OPEN_APIURL}${data.data[4].imageUrl}`}
          alt="GoHighBannerAnother"
          className="transition-transform w-full h-36 sm:h-52 object-cover md:h-80 duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default GoHighBannerAnother;
