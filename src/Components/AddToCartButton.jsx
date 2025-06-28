import useAddToCart from "../Hooks/useAddToCart";

const AddToCartButton = ({
  product,
  quantity = 1,
  selectedOptions = [],
  priceInfo,
  children,
}) => {
  const handleAddToCart = useAddToCart();
  return (
    <button
      onClick={() =>
        handleAddToCart({ product, quantity, selectedOptions, priceInfo })
      }
      className="cursor-pointer overflow-hidden group text-white px-16 font-semibold py-[5px] rounded-[3px] text-[16px] bg-[#e62245] hover:bg-red-800 w-full sm:w-auto whitespace-nowrap"
    >
      <span className="relative z-10"> {children || "ADD TO CART"}</span>
    </button>
  );
};

export default AddToCartButton;
