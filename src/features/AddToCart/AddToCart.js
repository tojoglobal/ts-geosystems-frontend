import { createSlice } from "@reduxjs/toolkit";

const saveCartToLocalStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
};

const initialState = {
  items: [],
  coupon: {},
  shipping: {},
  totalQuantity: 0,
  totalPrice: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      // Try to find a cart item with the same id and options
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.price * newItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          totalPrice: newItem.price * newItem.quantity,
        });
      }
      state.totalQuantity += newItem.quantity;
      state.totalPrice += newItem.price * newItem.quantity;
      saveCartToLocalStorage(state.items);
    },
    updateQuantity(state, action) {
      const { id, amount } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        const newQuantity = item.quantity + amount;

        if (newQuantity < 1) return;

        const pricePerUnit = item.totalPrice / item.quantity;

        state.totalQuantity += amount;
        state.totalPrice += pricePerUnit * amount;

        item.quantity = newQuantity;
        item.totalPrice = pricePerUnit * newQuantity;
        saveCartToLocalStorage(state.items);
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.items = state.items.filter((item) => item.id !== id);

        saveCartToLocalStorage(state.items);
      }
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload;
      saveCartToLocalStorage(state.items);
    },
    clearCoupon: (state) => {
      state.coupon = {};
      saveCartToLocalStorage(state.items);
    },
    // shiping logic
    setShipping: (state, action) => {
      state.shipping = action.payload;
    },
    clearShipping: (state) => {
      state.shipping = {};
      saveCartToLocalStorage(state.items);
    },
    // Clear the cart
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartToLocalStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCoupon,
  clearCoupon,
  setShipping,
  clearShipping,
} = CartSlice.actions;
export default CartSlice.reducer;
