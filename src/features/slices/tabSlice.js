import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "ALL",
};

export const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.value = action.payload;
    },
    resetTab: (state) => {
      state.value = "ALL";
    },
  },
});

export const { setTab, resetTab } = tabSlice.actions;

export default tabSlice.reducer;
