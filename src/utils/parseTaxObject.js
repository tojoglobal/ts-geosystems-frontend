// utils/parseTaxObject.js
export function parseTaxObject(taxData) {
  try {
    if (typeof taxData === "string") {
      const parsed = JSON.parse(taxData);
      return parsed?.value ? parsed : { value: 0 };
    }
    return taxData?.value ? taxData : { value: 0 };
  } catch {
    return { value: 0 };
  }
}
