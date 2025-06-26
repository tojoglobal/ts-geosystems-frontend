import { createSlice } from "@reduxjs/toolkit";

const saveCartToLocalStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
};

// Helper to generate a unique key for each cart item based on product id and sorted option IDs
function getCartItemKey(item) {
  const optionIds = (item.options || []).map((o) => o.id).sort((a, b) => a - b);
  return `${item.id}_${optionIds.join("_")}`;
}

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
      const newKey = getCartItemKey(newItem);
      const existingItem = state.items.find(
        (item) => getCartItemKey(item) === newKey
      );

      if (existingItem) {
        // If the item exists (same product and same options), just update quantity and prices
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.price * newItem.quantity;
        existingItem.price = newItem.price; // Update price in case options or VAT changed
        existingItem.priceIncVat = newItem.priceIncVat;
        existingItem.options = newItem.options;
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
      const { id, options, amount } = action.payload;
      const key = getCartItemKey({ id, options });
      const item = state.items.find((item) => getCartItemKey(item) === key);

      if (item) {
        const newQuantity = item.quantity + amount;
        if (newQuantity < 1) return;

        const pricePerUnit = item.price;
        state.totalQuantity += amount;
        state.totalPrice += pricePerUnit * amount;

        item.quantity = newQuantity;
        item.totalPrice = pricePerUnit * newQuantity;
        saveCartToLocalStorage(state.items);
      }
    },

    removeFromCart(state, action) {
      // Accept either an object {id, options} or a primitive id for backward compatibility
      let id, options;
      if (typeof action.payload === "object" && action.payload !== null) {
        id = action.payload.id;
        options = action.payload.options;
      } else {
        id = action.payload;
        options = [];
      }
      const key = getCartItemKey({ id, options });
      const existingItem = state.items.find(
        (item) => getCartItemKey(item) === key
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.items = state.items.filter(
          (item) => getCartItemKey(item) !== key
        );
        saveCartToLocalStorage(state.items);
      }
    },

    setCoupon(state, action) {
      state.coupon = action.payload;
      saveCartToLocalStorage(state.items);
    },

    clearCoupon(state) {
      state.coupon = {};
      saveCartToLocalStorage(state.items);
    },

    setShipping(state, action) {
      state.shipping = action.payload;
    },

    clearShipping(state) {
      state.shipping = {};
      saveCartToLocalStorage(state.items);
    },

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
