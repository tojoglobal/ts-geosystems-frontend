import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: null, // { slug, name }
  subcategory: null, // { slug, name }
  product: null, // { id, name }
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumb: (state, action) => {
      const { category, subcategory, product } = action.payload;
      state.category = category || null;
      state.subcategory = subcategory || null;
      state.product = product || null;
    },
    clearBreadcrumb: (state) => {
      state.category = null;
      state.subcategory = null;
      state.product = null;
    },
  },
});

export const { setBreadcrumb, clearBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
