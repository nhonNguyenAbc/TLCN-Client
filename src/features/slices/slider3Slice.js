import { createSlice } from "@reduxjs/toolkit";
import { handleDelete } from "../../utils/deleteImage";

const initialState = {
  value: "",
  publicId: "",
};

export const slider3Slice = createSlice({
  name: "slider3",
  initialState,
  reducers: {
    setSlider3: (state, action) => {
      state.value = action.payload.value;
      state.publicId = action.payload.publicId;
    },
    deleteSlider3: (state) => {
      handleDelete(state);
      state.value = "";
      state.publicId = "";
    },
    resetSlider3: (state) => {
      state.value = "";
      state.publicId = "";
    },
  },
});

export const { setSlider3, resetSlider3, deleteSlider3 } = slider3Slice.actions;

export default slider3Slice.reducer;
