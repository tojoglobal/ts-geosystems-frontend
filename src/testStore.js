// import { configureStore } from "@reduxjs/toolkit";
// import counterSlice from "./features/Counters/CounterSlice";
// import CartSlice from "./features/AddToCart/AddToCart";
// import StickySlice from "./features/Sticky/Sticky";
// import cartToggleReducer from "./features/CartToggleSlice/CartToggleSlice";
// import authUserReducer from "./features/UserAuth/authSlice";

// // utils to persist state
// const loadState = () => {
//   try {
//     const serializedState = localStorage.getItem("cart");
//     return serializedState ? JSON.parse(serializedState) : undefined;
//   } catch (err) {
//     console.error("Could not load cart from localStorage", err);
//     return undefined;
//   }
// };

// const saveState = (state) => {
//   try {
//     // const serializedState = JSON.stringify(state.cart);
//     const serializedState = JSON.stringify({
//       cart: state.cart, // Persist cart state
//       auth: state.auth, // Persist authentication state
//     });
//     // localStorage.setItem("cart", serializedState);
//     localStorage.setItem("state", serializedState);
//   } catch (err) {
//     console.error("Could not save cart to localStorage", err);
//   }
// };

// // Load cart state from localStorage
// const preloadedState = loadState();

// const store = configureStore({
//   reducer: {
//     counter: counterSlice,
//     cart: CartSlice,
//     sticky: StickySlice,
//     cartToggle: cartToggleReducer,
//     authUser: authUserReducer,
//   },
//   preloadedState: {
//     cart: preloadedState || {
//       items: [],
//       totalQuantity: 0,
//       totalPrice: 0,
//     },
//     auth: preloadedState?.auth || {
//       isAuth: false,
//       user: null,
//     },
//   },
// });

// // Save on every state change
// store.subscribe(() => {
//   saveState(store.getState());
// });

// export default store;
