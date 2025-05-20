import { twMerge } from "tailwind-merge";

export const LoadingSpinner = ({ className }) => {
  return (
    <div className={twMerge("flex justify-center items-center", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e62245]"></div>
    </div>
  );
};
