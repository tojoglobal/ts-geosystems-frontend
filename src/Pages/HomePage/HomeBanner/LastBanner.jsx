import useDataQuery from "../../../utils/useDataQuery";
import { SkeletonLoader } from "../../../utils/Loader/SkeletonLoader";

const LastBanner = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["lastBannerImages"],
    "/api/get-last-banner-images"
  );
  const LastBanner = data?.data || [];

  const bannerHeight =
    "h-[170px] sm:h-[180px] md:h-[270px]";
  const imageLoadingHeight = "h-full";

  if (isLoading) {
    return (
      <div className="w-full max-w-[95%] 2xl:max-w-[1370px] mx-auto px-3 md:px-0 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <SkeletonLoader className={`w-full ${bannerHeight} rounded-lg`} />
          <SkeletonLoader
            className={`w-full ${bannerHeight} rounded-lg hidden sm:block`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto px-3 md:px-0 mt-2">
      {LastBanner.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-400">
          No banners available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {LastBanner?.map((banner, idx) => (
            <div
              key={banner.id}
              className={`relative overflow-hidden rounded-lg group ${bannerHeight}`}
            >
              <div className="w-full h-full">
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${banner.photourl}`}
                  alt={`Last Banner ${idx + 1}`}
                  className={`w-full ${imageLoadingHeight} object-cover transition-transform duration-500 group-hover:scale-105`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path-to-fallback-image.jpg";
                  }}
                />
              </div>
            </div>
          ))}
          {LastBanner.length === 1 && (
            <div className={`hidden sm:block ${bannerHeight}`}></div>
          )}
        </div>
      )}
    </div>
  );
};

export default LastBanner;
