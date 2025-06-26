// src/utils/selectMergedCart.js
import { createSelector } from "reselect";
import { parsePrice } from "./parsePrice";
import { parseTaxObject } from "./parseTaxObject";
import { calculateVat } from "./calculateVat";

// Input selectors
const selectCartItems = (state) => state.cart.items;
const selectProducts = (_, products) => products;
const selectVatEnabled = (_, __, vatEnabled) => vatEnabled;

// Memoized selector
export const selectMergedCart = createSelector(
  [selectCartItems, selectProducts, selectVatEnabled],
  (items, products, vatEnabled) => {
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
        const { image_urls, product_options, brand_name } = product;
        return {
          ...item,
          // quantity: item.quantity,
          vatPerUnit,
          total_per_product_Vat: totalVat,
          // priceWithVat,
          brand_name,
          image_urls,
          product_options,
          price: vatEnabled ? item?.priceIncVat : priceWithVat,
          product_price: productPrice,
        };
      })
      .filter(Boolean);
  }
);
