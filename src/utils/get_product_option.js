export const getParsedProductOptions = (ProductOptions) => {
  // console.log(ProductOptions);

  // Already an array: return as-is
  if (Array.isArray(ProductOptions)) {
    return ProductOptions;
  }
  // String: parse as JSON, handle array/object
  if (typeof ProductOptions === "string") {
    try {
      const parsed = JSON.parse(ProductOptions);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") return [parsed];
    } catch (error) {
      console.error("Error parsing product options string:", error);
    }
    return [];
  }
  // Plain object: wrap in array
  if (ProductOptions && typeof ProductOptions === "object") {
    return [ProductOptions];
  }
  // Fallback: empty array
  return [];
};
