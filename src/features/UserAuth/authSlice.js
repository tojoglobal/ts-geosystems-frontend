import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
};

const authSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    // Action to set user data and authentication status
    loginSuccess(state, action) {
      state.isAuth = true; // Mark user as authenticated
      state.user = action.payload; // Save user info (e.g., email, role, etc.)
    },
    // Action to clear user data on logout
    logout(state) {
      state.isAuth = false; // Mark user as unauthenticated
      state.user = null; // Clear user info
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
