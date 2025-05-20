import { twMerge } from "tailwind-merge";

export const ImageLoader = ({ className }) => {
  return <div className={twMerge("animate-pulse bg-gray-200", className)} />;
};
