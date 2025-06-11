import useDataQuery from "../../../utils/useDataQuery";
import { SkeletonLoader } from "../../../utils/Loader/SkeletonLoader";

const LastBanner = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["lastBannerImages"],
    "/api/get-last-banner-images"
  );
  const LastBanner = data?.data || [];

  if (isLoading) {
    return (
      <div className="w-full max-w-[95%] 2xl:max-w-[1370px] mx-auto flex flex-col md:flex-row gap-4 px-3 md:px-0 mt-2">
        <SkeletonLoader className="w-full md:w-1/2 h-[190px] rounded-lg" />
        <SkeletonLoader className="w-full md:w-1/2 h-[190px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto flex flex-col md:flex-row gap-4 px-3 md:px-0 mt-2">
      {LastBanner.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-400">
          No banners available.
        </div>
      ) : (
        LastBanner?.map((banner, idx) => (
          <div
            key={banner.id}
            className="flex-1 overflow-hidden rounded-lg group transition-shadow duration-300"
            style={{ aspectRatio: "2.8/1", minHeight: "190px" }}
          >
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}${banner.photourl}`}
              alt={`Last Banner ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default LastBanner;
