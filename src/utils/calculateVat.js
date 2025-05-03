export const calculateVat = (price, quantity, taxRate) => {
  const vatPerUnit = price * taxRate;
  const totalVat = vatPerUnit * quantity;
  return {
    vatPerUnit,
    totalVat,
    priceWithVat: (price + vatPerUnit) * quantity,
  };
};
