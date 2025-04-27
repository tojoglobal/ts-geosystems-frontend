import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/Counters/CounterSlice";
import CartSlice from "./features/AddToCart/AddToCart";
const store = configureStore({
  reducer: {
    // Add your reducers here
    counter: counterSlice,
    cart: CartSlice,
  },
});

export default store;
