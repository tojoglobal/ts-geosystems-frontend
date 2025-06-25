export const getParsedProductOptions = (ProductOptions) => {
  //   console.log("getParsedProductOptions called with product:", ProductOptions);

  try {
    if (typeof ProductOptions === "string") {
      const parsed = JSON.parse(ProductOptions);
      if (Array.isArray(parsed)) {
        return parsed.map((option) => {
          return {
            ...option,
          };
        });
      }
      return parsed?.value ? parsed : { value: 0 };
    }
  } catch (error) {
    console.error("Error parsing product options:", error);
  }
  return null;
};
