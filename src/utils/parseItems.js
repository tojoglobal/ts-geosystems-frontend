// utils/parseTaxObject.js
export function parseItems(item) {
  try {
    if (typeof item === "string") {
      const parsed = JSON.parse(item);

      // If the parsed data is an array, map through and parse nested JSON strings
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => {
          return {
            ...entry,
            category: entry.category ? JSON.parse(entry.category) : null,
            sub_category: entry.sub_category
              ? JSON.parse(entry.sub_category)
              : null,
            tax: entry.tax ? JSON.parse(entry.tax) : null,
            product_options: entry.product_options
              ? JSON.parse(entry.product_options)
              : null,
            software_options: entry.software_options
              ? JSON.parse(entry.software_options)
              : null,
            image_urls: entry.image_urls ? JSON.parse(entry.image_urls) : null,
          };
        });
      }

      return parsed?.value ? parsed : { value: 0 };
    }
  } catch (error) {
    console.error("Error parsing item:", error);
    return { value: 0 };
  }
}
