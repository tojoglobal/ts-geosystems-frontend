// src/features/CartToggle/CartToggleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartVisible: false,
};

const cartToggleSlice = createSlice({
  name: "cartToggle",
  initialState,
  reducers: {
    toggleCart(state) {
      state.isCartVisible = !state.isCartVisible;
    },
    closeCart(state) {
      state.isCartVisible = false;
    },
    openCart(state) {
      state.isCartVisible = true;
    },
  },
});

export const { toggleCart, closeCart, openCart } = cartToggleSlice.actions;
export default cartToggleSlice.reducer;
