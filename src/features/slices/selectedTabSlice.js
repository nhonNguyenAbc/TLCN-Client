import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("selectedTab") || "Thống kê",
};

export const selectedTabSlice = createSlice({
  name: "selectedTab",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.value = action.payload;
      console.log(action.payload);
      localStorage.setItem("selectedTab", action.payload);
    },
  },
});

export const { setSelectedTab } = selectedTabSlice.actions;

export default selectedTabSlice.reducer;
