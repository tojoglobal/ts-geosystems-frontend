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
      <div className="md:max-w-[1370px] md:mx-auto flex flex-col md:flex-row gap-4">
        <SkeletonLoader className="w-full md:w-1/2 h-[190px]" />
        <SkeletonLoader className="w-full md:w-1/2 h-[190px]" />
      </div>
    );
  }
  return (
    <div className="max-w-[1370px] mx-3 md:mx-auto flex items-center gap-[14px] overflow-hidden mt-1 rounded-lg">
      {LastBanner.length === 0 && (
        <div className="w-full text-center py-10 text-gray-400">
          No banners available.
        </div>
      )}
      {LastBanner.map((banner, idx) => (
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
      ))}
    </div>
  );
};

export default LastBanner;
