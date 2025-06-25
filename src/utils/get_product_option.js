export const getParsedProductOptions = (product) => {
  console.log("getParsedProductOptions called with product:", product);

  if (!product.product_options) {
    return {
      hasOptions: false,
      isSimpleProduct: true,
    };
  }

  let options;
  try {
    options = JSON.parse(product.product_options);
  } catch (error) {
    console.error("Error parsing product options:", error);
    return {
      hasOptions: false,
      isSimpleProduct: true,
    };
  }

  // Check if options is an empty array (string "[]" parsed to [])
  const isEmptyOptions = Array.isArray(options) && options.length === 0;

  return {
    hasOptions: !isEmptyOptions,
    isSimpleProduct: isEmptyOptions,
  };
};
