import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage for persistence
import counterSlice from "./features/Counters/CounterSlice";
import CartSlice from "./features/AddToCart/AddToCart";
import StickySlice from "./features/Sticky/Sticky";
import cartToggleReducer from "./features/CartToggleSlice/CartToggleSlice";
import authUserReducer from "./features/UserAuth/authSlice";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Configure persistence
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "authUser"], // Only persist cart and authUser slices
};

const rootReducer = combineReducers({
  authUser: authUserReducer,
  counter: counterSlice,
  cart: CartSlice,
  sticky: StickySlice,
  cartToggle: cartToggleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore actions from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
