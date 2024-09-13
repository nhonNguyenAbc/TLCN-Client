import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider1Slice = createSlice({
  name: "slider1",
  initialState,
  reducers: {
    setSlider1: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider1: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider1: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider1, resetSlider1, deleteSlider1 } = slider1Slice.actions;

export default slider1Slice.reducer;
