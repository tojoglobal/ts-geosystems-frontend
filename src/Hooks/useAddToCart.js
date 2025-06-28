import { useDispatch } from "react-redux";
import { addToCart } from "../features/AddToCart/AddToCart";
import useToastSwal from "../Hooks/useToastSwal";
import { getTotalPriceInfo } from "../utils/getTotalPriceInfo";
import { useVatEnabled } from "./useVatEnabled";

const useAddToCart = () => {
  const dispatch = useDispatch();
  const showToast = useToastSwal();
  const { data: vatEnabled = true } = useVatEnabled?.() || {};

  /**
   * Adds an item to the cart and shows a toast.
   * @param {Object} params
   * @param {Object} params.product - The product object.
   * @param {number} params.quantity - Quantity to add.
   * @param {Array} params.selectedOptions - Options/accessories selected.
   * @param {Object} params.priceInfo - Price info object {base, vat, incVat}.
   */
  const handleAddToCart = ({
    product,
    quantity = 1,
    selectedOptions = [],
    priceInfo,
  }) => {
    if (!product?.id) return;

    // If priceInfo is not provided, calculate it
    const _selectedOptions = selectedOptions || [];
    const _priceInfo =
      priceInfo || getTotalPriceInfo(product, _selectedOptions, vatEnabled);

    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      quantity,
      options: _selectedOptions.map((opt) => ({
        id: opt.value || opt.id,
        label: opt.label,
        price: opt.price,
        tax: opt.tax,
      })),
      price: _priceInfo.incVat || product.price,
      priceBase: _priceInfo.base || product.price,
      vat: _priceInfo.vat || 0,
      priceIncVat: _priceInfo.incVat || product.price,
      image_urls: product.image_urls,
      brand_name: product.brand_name,
      product_options: product.product_options,
    };
    dispatch(addToCart(itemToAdd));
    showToast(
      "success",
      "Added to Cart!",
      `<b style="color:#333">${product.product_name}</b> has been added to your cart.`,
      { timer: 2000 }
    );
    if (product.id) {
      localStorage.setItem(
        `productOptions_${product.id}`,
        JSON.stringify({ selectedOptions: _selectedOptions, quantity })
      );
    }
  };

  return handleAddToCart;
};

export default useAddToCart;
