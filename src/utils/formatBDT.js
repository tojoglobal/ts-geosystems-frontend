// Format number as Bangladeshi/Indian currency: 2,33,000.00
export function formatBDT(price) {
  if (price == null || price === "") return "";
  // Ensure it's a string and handle decimals
  let [intPart, decimalPart] = price.toString().split(".");
  let lastThree = intPart.slice(-3);
  let otherNumbers = intPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  // Add commas every two digits for the rest
  let formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  if (decimalPart) {
    formatted += "." + decimalPart.padEnd(2, "0").slice(0, 2);
  } else {
    formatted += ".00";
  }
  return formatted;
}
