import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/Counters/CounterSlice";
import CartSlice from "./features/AddToCart/AddToCart";
import StickySlice from "./features/Sticky/Sticky";

// utils to persist state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error("Could not load cart from localStorage", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem("cart", serializedState);
  } catch (err) {
    console.error("Could not save cart to localStorage", err);
  }
};

// Load cart state from localStorage
const preloadedCartState = loadState();

const store = configureStore({
  reducer: {
    counter: counterSlice,
    cart: CartSlice,
    sticky: StickySlice,
  },
  preloadedState: {
    cart: preloadedCartState || {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    },
  },
});

// Save on every state change
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
