import { FaChevronLeft } from "react-icons/fa";

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-prev absolute top-1/2 -left-8 text-2xl transform -translate-y-1/2 text-[#e62245]  p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );
};
export default PrevArrow;
