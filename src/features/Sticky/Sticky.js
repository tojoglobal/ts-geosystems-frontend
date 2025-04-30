import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSticky: false, // Initial state for sticky functionality
};

const StickySlice = createSlice({
  name: "sticky",
  initialState,
  reducers: {
    setSticky(state, action) {
      state.isSticky = action.payload;
    },
  },
});

// Export the action
export const { setSticky } = StickySlice.actions;

// Export the reducer
export default StickySlice.reducer;
