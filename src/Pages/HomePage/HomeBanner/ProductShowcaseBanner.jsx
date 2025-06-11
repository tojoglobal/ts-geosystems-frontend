import useDataQuery from "../../../utils/useDataQuery";

const ProductShowcaseBanner = () => {
  const { data = [], isLoading } = useDataQuery(
    ["productShowcaseBanner"],
    "/api/get-homepage-single-images"
  );
  if (isLoading) return null;
  return (
    <div className="mt-6 md:mt-10 w-full max-w-[95%] 2xl:max-w-[1370px] mx-3 md:mx-auto overflow-hidden rounded-lg">
      <img
        src={`${import.meta.env.VITE_OPEN_APIURL}${data?.data[3]?.imageUrl}`}
        alt="ProductShowcaseBanner"
        className="transition-transform w-full h-36 object-cover md:h-80 duration-300 hover:scale-110"
      />
    </div>
  );
};

export default ProductShowcaseBanner;
