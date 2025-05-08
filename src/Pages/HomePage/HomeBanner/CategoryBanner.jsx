import { Link } from "react-router-dom";
const categories = [
  {
    title: "robotic total station",
    image:
      "https://ts-geosystems.com.bd/assets/images/1726595485leica-gnss-systems.jpg",
    slug: "robotic_total_station",
  },
  {
    title: "handheld gps",
    image:
      "https://ts-geosystems.com.bd/assets/images/1629616243pexels-karolina-grabowska-4498574.jpg",
    slug: "handheld_gps",
  },
  {
    title: "rtk gnss system",
    image:
      "https://ts-geosystems.com.bd/assets/images/1735551569leica-gnss-systems.jpg",
    slug: "rtk_gnss_system",
  },
  {
    title: "3d laser scanner",
    image:
      "https://ts-geosystems.com.bd/assets/images/1735551487leica-3d-laser-scanning.jpg",
    slug: "3d_laser_scanner",
  },
  {
    title: "echo sounder",
    image:
      "https://ts-geosystems.com.bd/assets/images/1735551675leica-total-stations%20(1).jpg",
    slug: "echo_sounder",
  },
];

const CategoryBanner = () => {
  return (
    <div className="max-w-[1370px] mt-10 mx-3 md:mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
      {categories.map((category, index) => (
        <Link
          to={`/catalog?category=${category.slug}`}
          key={index}
          className="group text-center cursor-pointer"
        >
          <div className="overflow-hidden rounded-md">
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-36 md:h-auto transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="mt-1 md:mt-3 uppercase text-sm font-semibold transition-colors duration-300 group-hover:text-[#e62446]">
            {category.title}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryBanner;
