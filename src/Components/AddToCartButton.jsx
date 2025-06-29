import useAddToCart from "../Hooks/useAddToCart";

const AddToCartButton = ({
  product,
  quantity = 1,
  selectedOptions = [],
  priceInfo,
  children,
  variant,
  showAddToCartButton = true,
}) => {
  const handleAddToCart = useAddToCart();

  if (!showAddToCartButton) return null;

  const className =
    variant === "details"
      ? "cursor-pointer overflow-hidden group text-white px-16 font-semibold py-[5px] rounded-[3px] text-[16px] bg-[#e62245] hover:bg-red-800 w-full sm:w-auto"
      : "cursor-pointer overflow-hidden group text-white font-semibold py-[5px] px-4 lg:px-9 rounded-[4px] text-sm bg-[#e62245] hover:bg-red-800 w-full transition-all";

  return (
    <button
      onClick={() =>
        handleAddToCart({ product, quantity, selectedOptions, priceInfo })
      }
      className={className}
    >
      <span className="relative z-10">{children || "ADD TO CART"}</span>
    </button>
  );
};

export default AddToCartButton;
