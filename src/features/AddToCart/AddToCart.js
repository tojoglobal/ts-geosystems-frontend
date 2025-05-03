import { createSlice } from "@reduxjs/toolkit";
import { getFirstImage } from "../../utils/getFirstImage";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      // Remove commas from price and convert to number
      const numericPrice = Number(newItem.price.toString().replace(/,/g, ""));
      const taxRate = newItem.tax?.value || 0;
      console.log(taxRate, newItem);

      // Calculate VAT
      const vat = numericPrice * taxRate;
      const totalVat = vat * newItem.quantity;
      const totalPriceWithVat = (numericPrice + vat) * newItem.quantity;

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.price * newItem.quantity;
      } else {
        state.items.push({
          // ...newItem,
          id: newItem.id,
          product_name: newItem.product_name,
          product_image: getFirstImage(newItem.image_urls),
          price: numericPrice,
          quantity: newItem.quantity,
          totalPrice: totalPriceWithVat,
          vat: vat,
          totalVat: totalVat,
          totalPrice_old: newItem.price * newItem.quantity,
        });
      }

      state.totalQuantity += newItem.quantity;
      // state.totalPrice += newItem.price * newItem.quantity;
      state.totalPrice += totalPriceWithVat;
    },
    updateQuantity(state, action) {
      const { id, amount } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        const newQuantity = item.quantity + amount;

        if (newQuantity < 1) return;

        // const pricePerUnit = item.totalPrice / item.quantity;
        const pricePerUnit = item.price;
        const vat = item.vat;
        const newTotalPrice = (pricePerUnit + vat) * newQuantity;
        const newTotalVat = vat * newQuantity;

        state.totalQuantity += amount;
        // state.totalPrice += pricePerUnit * amount;
        state.totalPrice += newTotalPrice - item.totalPrice;

        item.quantity = newQuantity;
        // item.totalPrice = pricePerUnit * newQuantity;
        item.totalPrice = newTotalPrice;
        item.totalVat = newTotalVat;
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  CartSlice.actions;
export default CartSlice.reducer;
