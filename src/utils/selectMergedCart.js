// src/utils/selectMergedCart.js
import { createSelector } from "reselect";
import { parsePrice } from "./parsePrice";
import { parseTaxObject } from "./parseTaxObject";
import { calculateVat } from "./calculateVat";

// Input selectors
const selectCartItems = (state) => state.cart.items;
const selectProducts = (_, products) => products;

// Memoized selector
export const selectMergedCart = createSelector(
  [selectCartItems, selectProducts],
  (items, products) => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;

        const productPrice = parsePrice(product?.price);
        const taxe = parseTaxObject(product?.tax);
        const { vatPerUnit, totalVat, priceWithVat } = calculateVat(
          productPrice,
          item?.quantity,
          taxe.value || 0
        );

        return {
          ...product,
          quantity: item.quantity,
          vatPerUnit,
          totalVat,
          priceWithVat,
          price: productPrice,
        };
      })
      .filter(Boolean);
  }
);
