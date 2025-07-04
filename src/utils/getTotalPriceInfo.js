export function getTotalPriceInfo(product, selectedOptions = [], vatEnabled) {
  // Ensure selectedOptions is always an array
  const options = Array.isArray(selectedOptions) ? selectedOptions : [];

  const productBasePrice = parseFloat(product?.price) || 0;
  const productVat = product?.tax ? JSON.parse(product.tax).value : 0;

  let totalBasePrice = productBasePrice;
  let totalVatAmount = vatEnabled ? productBasePrice * (productVat / 100) : 0;

  options.forEach((opt) => {
    const optPrice = parseFloat(opt.price) || 0;
    let optVat = 0;
    if (vatEnabled) {
      optVat = opt?.tax ? JSON.parse(opt.tax).value : 0;
    }
    totalBasePrice += optPrice;
    totalVatAmount += vatEnabled ? optPrice * (optVat / 100) : 0;
  });

  return {
    base: totalBasePrice,
    vat: totalVatAmount,
    incVat: totalBasePrice + totalVatAmount,
  };
}
