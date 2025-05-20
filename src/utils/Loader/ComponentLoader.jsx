import { LoadingSpinner } from "./LoadingSpinner";
import { SkeletonLoader } from "./SkeletonLoader";

export const ComponentLoader = ({ type = "spinner", componentName }) => {
  // Custom loaders for specific components
  if (componentName === "MainBanner") {
    return (
      <div className="w-full h-[540px] bg-gray-100 flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  if (componentName === "ProductHighlights") {
    return (
      <div className="max-w-[1370px] mx-auto px-3 py-12">
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} className="h-8 w-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <SkeletonLoader className="h-64 w-full" />
              <SkeletonLoader className="h-4 w-3/4" />
              <SkeletonLoader className="h-4 w-1/2" />
              <SkeletonLoader className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default loaders based on type
  if (type === "spinner") {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SkeletonLoader className="h-6 w-1/2" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-3/4" />
    </div>
  );
};
