import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider2Slice = createSlice({
  name: "slider2",
  initialState,
  reducers: {
    setSlider2: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider2: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider2: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider2, resetSlider2,deleteSlider2 } = slider2Slice.actions;

export default slider2Slice.reducer;
