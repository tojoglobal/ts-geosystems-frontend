export function parsePrice(price) {
  if (!price) return 0;
  return Number(price.toString().replace(/,/g, ""));
}
