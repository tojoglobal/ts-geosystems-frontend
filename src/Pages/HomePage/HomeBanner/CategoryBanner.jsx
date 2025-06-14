import { Link } from "react-router-dom";
import useDataQuery from "../../../utils/useDataQuery";

const CategoryBanner = () => {
  const { data, isLoading } = useDataQuery(["category"], "/api/category");
  if (isLoading) return null;

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mt-5 md:mt-10 px-3 md:px-0 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5">
      {data?.categories?.slice(0, 5).map((category) => (
        <Link
          to={`/${category.slug_name}`}
          key={category.id}
          className="group text-center cursor-pointer"
        >
          <div className="overflow-hidden border border-gray-200 rounded-sm">
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                category.photo
              }`}
              alt={category.category_name}
              className="w-full mx-auto h-36 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="mt-1 md:mt-2 uppercase text-sm font-semibold transition-colors duration-300 group-hover:text-[#e62446]">
            {category.category_name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryBanner;
