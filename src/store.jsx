import { createStore } from "@reduxjs/toolkit";
import counterReducer from "./Dashboard/Categorys/reducers/CounterReducers";

const store = createStore(counterReducer);
export default store;
