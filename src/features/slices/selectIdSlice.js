import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: -1,
  change: false,
};

export const selectedIdSlice = createSlice({
  name: "selectedId",
  initialState,
  reducers: {
    setSelectedId: (state, action) => {
      state.value = action.payload;
      if (state.value !== action.payload && state.value !== -1) {
        state.change = true;
      }
    },
    resetSelectedId: (state) => {
      state.value = -1;
      state.change = false;
    },
  },
});

export const { setSelectedId, resetSelectedId } = selectedIdSlice.actions;

export default selectedIdSlice.reducer;
