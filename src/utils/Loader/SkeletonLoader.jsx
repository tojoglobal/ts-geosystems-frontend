import { twMerge } from "tailwind-merge";

export const SkeletonLoader = ({ className, count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((item) => (
        <div
          key={item}
          className={twMerge("animate-pulse bg-gray-200 rounded-md", className)}
        />
      ))}
    </>
  );
};
