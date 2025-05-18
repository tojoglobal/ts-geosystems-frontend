export const getProductType = (product) => {
  if (!product.product_options) {
    return {
      hasOptions: false,
      isSimpleProduct: true,
    };
  }

  const options = JSON.parse(product.product_options);

  // Check if options is an empty array (string "[]" parsed to [])
  const isEmptyOptions = options.length === 0;

  return {
    hasOptions: !isEmptyOptions,
    isSimpleProduct: isEmptyOptions,
  };
};
