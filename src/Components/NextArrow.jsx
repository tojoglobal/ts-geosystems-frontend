import { FaChevronRight } from "react-icons/fa";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-next absolute top-1/2 -right-8 text-2xl transform -translate-y-1/2 text-[#e62245] p-2 rounded-full cursor-pointer z-10"
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );
};

export default NextArrow;
