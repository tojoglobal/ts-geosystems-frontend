import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import useProductsByIdsQuery from "../../Hooks/useProductsByIdsQuery";
import {
  clearCoupon,
  removeFromCart,
  setCoupon,
  updateQuantity,
  setShipping,
  clearShipping,
  addToCart,
} from "../../features/AddToCart/AddToCart";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { selectMergedCart } from "../../utils/selectMergedCart";
import useToastSwal from "../../Hooks/useToastSwal";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
import { useQuery } from "@tanstack/react-query";
import { formatBDT } from "../../utils/formatBDT";
import { slugify } from "../../utils/slugify";
import { getParsedProductOptions } from "../../utils/get_product_option";
import { getFirstImage } from "../../utils/getFirstImage";
import { getTotalPriceInfo } from "../../utils/getTotalPriceInfo";

const Cart = () => {
  const axiosPublicUrl = useAxiospublic();
  const [optionModal, setOptionModal] = useState({
    open: false,
    item: null,
    product: null,
    selectedOptions: [],
  });
  const dispatch = useDispatch();
  const showToast = useToastSwal();
  const { data: vatEnabled = true } = useVatEnabled();
  const { items, coupon, shipping } = useSelector((state) => state.cart);

  // Shipping state
  const [showShippingOptions, setShowShippingOptions] = useState(false);

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  // Fetch shipping costs
  const { data: shippingCosts = [] } = useQuery({
    queryKey: ["shipping-costs"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/shipping-costs");
      return res.data;
    },
  });

  // Only active shipping options
  const activeShippingOptions = shippingCosts.filter(
    (opt) => opt?.status === 1 || opt?.status === true
  );

  // Use the shipping from the cart state if available
  const shippingCost =
    shipping && shipping.amount ? parseFloat(shipping.amount) : 100;
  const productIds = useMemo(() => items.map((item) => item.id), [items]);
  const { products } = useProductsByIdsQuery(productIds);
  const mergedCart = useSelector((state) =>
    selectMergedCart(state, products, vatEnabled)
  );

  const priceInfo = getTotalPriceInfo(
    optionModal.product,
    optionModal.selectedOptions,
    vatEnabled,
    items
  );
  const handleQuantityChange = (item, delta) => {
    dispatch(
      updateQuantity({ id: item.id, options: item.options, amount: delta })
    );
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart({ id: item.id, options: item.options }));
    showToast("success", "Removed!", "Item removed from cart.");
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await axiosPublicUrl.post("api/promocode", {
        code_name: couponInput.trim(),
      });
      if (!res.data) {
        showToast("error", "Your Coupon is invalid", "Invalid coupon.");
        dispatch(clearCoupon());
        return;
      }
      const data = res.data;
      dispatch(setCoupon(data));
      showToast("Success", "success", `Coupon "${data.code_name}" applied!`);
    } catch (err) {
      console.error(err);
      dispatch(clearCoupon());
      showToast(
        "error",
        "error",
        "An error occurred while applying the coupon"
      );
    }
  };

  // Calculate VAT per item and total VAT for the cart
  const vat = mergedCart.reduce(
    (total, item) => total + (item.vat || 0) * (item.quantity || 1),
    0
  );

  const subTotal = mergedCart.reduce(
    (total, item) => total + item.priceIncVat * item.quantity,
    0
  );

  let discount = 0;
  if (coupon && coupon.code_name) {
    if (coupon.type === "percentage") {
      discount = (subTotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.discount;
    }
  }

  // const grandTotal =
  //   subTotal + (vatEnabled ? vat : 0) + shippingCost - discount;
  const grandTotal = subTotal + shippingCost - discount;

  const handleShippingChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selected = activeShippingOptions.find((opt) => opt.id === selectedId);
    if (selected) {
      dispatch(setShipping(selected));
      setShowShippingOptions(false);
    }
  };

  const handleResetShipping = () => {
    dispatch(clearShipping());
    setShowShippingOptions(true);
  };

  const toggleShippingOptions = () => {
    setShowShippingOptions((prev) => !prev);
  };

  // Open option edit modal
  const openOptionModal = (item, product) => {
    setOptionModal({
      open: true,
      item,
      product,
      selectedOptions: item.options || [],
    });
  };

  // Handle option (accessory) checkbox toggle
  const handleOptionChange = (changedOption, checked) => {
    let newSelectedOptions;
    if (checked) {
      if (
        !(optionModal.selectedOptions || []).some(
          (o) => o.id === changedOption.value
        )
      )
        newSelectedOptions = [
          ...(optionModal.selectedOptions || []),
          {
            id: changedOption.value,
            label: changedOption.label,
            price: changedOption.price,
            tax: changedOption.tax,
          },
        ];
      else newSelectedOptions = optionModal.selectedOptions;
    } else {
      // Remove the unchecked option
      newSelectedOptions = (optionModal.selectedOptions || []).filter(
        (o) => o.id !== changedOption.value
      );
    }
    setOptionModal((prev) => ({
      ...prev,
      selectedOptions: newSelectedOptions,
    }));
  };

  // Save changes: replace the cart item with the new options and updated price
  const saveOptionChanges = () => {
    const priceInfo = getTotalPriceInfo(
      optionModal.product,
      optionModal.selectedOptions,
      vatEnabled
    );

    // Remove old item (if needed, depends on your reducer)
    dispatch(
      removeFromCart({
        id: optionModal.item.id,
        options: optionModal.item.options || [],
      })
    );
    const itemToAdd = {
      ...optionModal.item,
      options: optionModal.selectedOptions,
      price: vatEnabled ? priceInfo.incVat : priceInfo.base,
      priceIncVat: priceInfo.incVat,
      vat: priceInfo.vat,
    };
    // Add updated item
    dispatch(addToCart(itemToAdd));
    setOptionModal({
      open: false,
      item: null,
      product: null,
      selectedOptions: [],
    });
  };

  console.log(mergedCart);

  return (
    <div className="md:p-2">
      <div className="flex items-center gap-2 text-xs mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Your Cart</span>
      </div>
      {mergedCart.length === 0 ? (
        <p className="text-xl">Your cart is empty.</p>
      ) : (
        <>
          <h1 className="text-xl md:text-3xl font-light mb-4">
            Your Cart ({mergedCart.length} Items)
          </h1>
          {/* Mobile Cart View */}
          <div className="block border rounded-lg  md:hidden space-y-4 mt-2 shadow-sm">
            {mergedCart.map((item) => (
              <div
                key={item.id}
                className=" p-3 flex flex-col sm:flex-row gap-4 border-b-2 "
              >
                <img
                  src={
                    item.image_urls
                      ? `${import.meta.env.VITE_OPEN_APIURL}${
                          JSON.parse(item.image_urls)[0]
                        }`
                      : "/placeholder.jpg"
                  }
                  alt={item.product_name}
                  className="w-24 h-24 object-contain mx-auto sm:mx-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-base">
                      {item.product_name}
                    </h2>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 cursor-pointer"
                    >
                      <RxCross2 />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    Price: ৳{formatBDT(item?.price)}
                  </p>
                  {/* {vatEnabled && (
                    <p className="text-sm text-gray-700 mb-1">
                      VAT: ৳{formatBDT(item.vat)}
                    </p>
                  )} */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Qty:</span>
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      className="px-2 py-1 border rounded hover:bg-gray-200 text-sm"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-200 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-3 text-sm font-medium">
                    Total: ৳{formatBDT(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* TABLE VIEW FOR DESKTOP, always first */}
          <table className="w-full border-collapse mb-6 hidden  md:table">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Image</th>
                <th className="py-2">Item Name</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                {/*<th className="py-2">vat</th>*/}
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {mergedCart.map((item) => {
                const product = products.find((p) => p.id === item.id);
                const chekProductOption = JSON.parse(product?.product_options);
                console.log("product_options", chekProductOption);
                console.log("options", item?.options);

                return (
                  <tr key={item.id} className="border-b">
                    <td className="flex items-center gap-4 py-4">
                      <img
                        src={
                          item.image_urls
                            ? `${import.meta.env.VITE_OPEN_APIURL}${
                                JSON.parse(item.image_urls)[0]
                              }`
                            : "/placeholder.jpg"
                        }
                        alt={item.product_name}
                        className="w-20 h-20 object-contain"
                      />
                    </td>
                    <td className="w-2xs">
                      {/* Brand Name */}
                      <p className="font-medium pr-3">
                        {item?.brand_name ?? "Unknown Brand"}
                      </p>

                      {/* Product Name with Link */}
                      <Link
                        to={`/products/${item?.id}/${slugify(
                          item?.product_name || "product"
                        )}`}
                      >
                        <p className="font-medium pr-3 text-[#e62245] underline hover:text-[#e62246b0]">
                          {item?.product_name ?? "Unnamed Product"}
                        </p>
                      </Link>

                      {/* Check for valid product options */}
                      {Array.isArray(chekProductOption) &&
                        chekProductOption.length > 0 && (
                          <>
                            <p>
                              Additional Accessory:{" "}
                              {Array.isArray(item?.options) &&
                              item.options.length > 0
                                ? item.options
                                    .map((o) => o?.label ?? "Unnamed Option")
                                    .join(", ")
                                : "None"}
                            </p>

                            {/* Change option link */}
                            <p
                              className="font-medium text-[#e62245] underline hover:text-[#e62246b0] cursor-pointer"
                              onClick={() => openOptionModal?.(item, product)}
                            >
                              Change
                            </p>
                          </>
                        )}
                    </td>

                    <td>৳{formatBDT(item?.priceIncVat)}</td>
                    <td>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="px-2 border rounded hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="px-2 border rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    {/* {vatEnabled && <td>৳{formatBDT(item?.vat)}</td>} */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <p>৳{formatBDT(item.priceIncVat * item.quantity)}</p>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-500 cursor-pointer"
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Option Change Popup/Modal */}
            {optionModal.open && (
              <div className="fixed z-50 inset-0 bg-black/80 flex items-center justify-center px-5">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-full relative py-6 px-3 sm:px-6 flex flex-col">
                  <h2 className="text-xl font-light text-[#2f2f2b] mb-4 text-center">
                    Configure '{optionModal.item?.product_name}'
                  </h2>
                  {/* Scrollable options list */}
                  <div
                    className="overflow-y-auto border rounded-md border-gray-200 bg-gray-50 flex-1"
                    style={{ maxHeight: "60vh", minHeight: "200px" }}
                  >
                    <ul className="divide-y divide-gray-200">
                      {/* "None" Option */}
                      <li className="p-4 flex items-center">
                        <label className="flex items-center cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={optionModal.selectedOptions.length === 0}
                            onChange={() =>
                              setOptionModal((prev) => ({
                                ...prev,
                                selectedOptions: [],
                              }))
                            }
                            className="mr-3 accent-[#e62245] w-5 h-5"
                          />
                          <span className="text-gray-700 font-medium">
                            None
                          </span>
                        </label>
                      </li>
                      {/* Accessories */}
                      {getParsedProductOptions(
                        optionModal.item?.product_options
                      ).map((opt) => (
                        <li
                          key={opt.value}
                          className="p-4 flex items-center gap-4"
                        >
                          <img
                            src={`${
                              import.meta.env.VITE_OPEN_APIURL
                            }${getFirstImage(opt.image_urls)}`}
                            alt={opt.label}
                            className="w-12 h-12 object-cover rounded border border-gray-200 bg-white"
                          />
                          <label className="flex items-center cursor-pointer w-full">
                            <input
                              type="checkbox"
                              name="product_option"
                              checked={optionModal.selectedOptions.some(
                                (o) => o.id === opt.value
                              )}
                              onChange={(e) =>
                                handleOptionChange(opt, e.target.checked)
                              }
                              className="mr-3 accent-[#e62245] w-5 h-5"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">
                                {opt.label}
                              </span>
                            </div>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <div className="text-base font-semibold text-gray-800">
                      Price: ৳
                      {formatBDT(
                        vatEnabled ? priceInfo.incVat : priceInfo.base
                      )}
                      {vatEnabled && (
                        <span className="ml-1 text-xs text-gray-500">
                          (Inc. VAT: ৳{formatBDT(priceInfo.vat)})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        onClick={() =>
                          setOptionModal({
                            open: false,
                            item: null,
                            product: null,
                            selectedOptions: [],
                          })
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-[#e62245] text-white rounded hover:bg-[#c81a3d] transition"
                        onClick={saveOptionChanges}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </table>

          {/*This is footer Calcuation part  */}
          <div className="max-w-lg ml-auto p-2 md:p-4 rounded space-y-4">
            {/* Totals */}
            <div className="flex justify-between mb-2 border-b pb-2">
              <span>Subtotal:</span>
              <span>৳{formatBDT(subTotal)}</span>
            </div>

            {/* Coupon Section */}
            <div className="mb-2 border-b pb-2">
              <label className="mb-1 text-base font-medium flex justify-between cursor-pointer">
                Coupon Code:
                {!showCouponInput ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-[#e62245] cursor-pointer ml-2 underline text-sm"
                  >
                    Show Coupon
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCouponInput(false)}
                    className="text-gray-500 cursor-pointer ml-2 underline text-sm"
                  >
                    Cancel
                  </button>
                )}
              </label>
              {showCouponInput && (
                <>
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter your coupon code"
                      className="w-full px-3 py-2 border rounded mt-2"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#e62245] cursor-pointer text-white py-2 px-3 mt-2 rounded"
                    >
                      APPLY
                    </button>
                  </div>
                  {couponInput && (
                    <>
                      {coupon && coupon.code_name === couponInput.trim() ? (
                        <p className="text-green-600 text-sm mt-1">
                          Valid coupon code:{" "}
                          {coupon.type === "percentage"
                            ? `${coupon.discount}% off`
                            : `৳${coupon.discount} off`}
                        </p>
                      ) : (
                        <p className="text-red-600 text-sm mt-1">
                          Invalid coupon code
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Shipping Section - improved show/hide/reset */}
            <div className="mb-2 border-b pb-2">
              <label className="mb-1 text-base font-medium flex justify-between cursor-pointer">
                Shipping:
                <div className="flex gap-2">
                  {shipping?.id && (
                    <button
                      onClick={handleResetShipping}
                      className="text-gray-500 underline text-sm"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={toggleShippingOptions}
                    className="text-[#e62245] underline text-sm"
                  >
                    {showShippingOptions
                      ? "Hide"
                      : shipping?.id
                      ? "Change"
                      : "Choose"}
                  </button>
                </div>
              </label>
              {showShippingOptions && (
                <div className="flex flex-col gap-2 mt-2">
                  {activeShippingOptions.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      No shipping options available
                    </span>
                  )}
                  {activeShippingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 cursor-pointer rounded hover:bg-gray-50 py-1 px-2 transition"
                      style={{
                        border:
                          shipping?.id === opt.id
                            ? "1px solid #e62245"
                            : "1px solid #e5e7eb",
                        background:
                          shipping?.id === opt.id ? "#fff0f3" : "#fff",
                      }}
                    >
                      <input
                        type="radio"
                        value={opt.id}
                        checked={shipping?.id === opt.id}
                        onChange={handleShippingChange}
                      />
                      <span className="font-medium">{opt.name}</span>
                      <span className="ml-auto text-sm text-gray-600">
                        ৳{formatBDT(parseFloat(opt.amount))}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {!showShippingOptions && shipping?.name && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium">{shipping.name}</span>
                  <span className="text-sm text-gray-600">
                    (৳{formatBDT(parseFloat(shipping.amount))})
                  </span>
                </div>
              )}
            </div>
            {vatEnabled && (
              <div className="flex justify-between mb-2 border-b pb-2">
                <span>VAT:</span>
                <span>৳{formatBDT(vat)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2 border-b pb-2">
              <span>Shipping:</span>
              <span>৳{formatBDT(shippingCost)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 border-b pb-2 text-green-600">
                <span>Discount:</span>
                <span>-৳{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold">
              <span>Grand Total:</span>
              <span>৳{formatBDT(grandTotal)}</span>
            </div>
            <div className="flex justify-end mt-5">
              <Link to="/checkout">
                <button className="bg-[#e62245] cursor-pointer text-white py-2 px-6 rounded">
                  CHECKOUT
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
